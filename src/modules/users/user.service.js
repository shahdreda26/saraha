import * as enums from "../../common/enum/user.enum.js"
import { successResponse } from "../../common/utils/response/success.response.js"
import { encrypt, decrypt } from "../../common/utils/security/encrypt.security.js"
import { Hash, compareHash } from "../../common/utils/security/hash.security.js"
import { generate_token, verify_token } from "../../common/utils/token.service.js"
import * as db_service from "../../db/db.service.js"
import { userModel } from "../../db/models/user.model.js"
import { OAuth2Client } from "google-auth-library"
import { refresh_secret_key, salt_rounds, secret_key } from "../../../config/config.service.js"
import cloudinary from "../../common/utils/cloudinary.js"
import { randomUUID } from "crypto"
import { keys, setValue,deleteKey ,get_token,revoke_prefix,getValue} from "../../db/redis/redis.service.js"
import { send } from "process"

export const signUp = async (req, res, next) => {
    const { userName, email, password, cpassword, gender, phone } = req.body
    
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {// await --> error promise
            folder: "saraha_app/users",// if folder exist add photo if not exist create it
            //public_id:"shahd" //overwrite دا مش كويس لانه بيرجعنى ل
            use_filename: true,// public_id ك filename هيستخدم اسم -->"ef028a1731199938d6c36d144896488e_y2yt6f"
            unique_filename: false,// _y2yt6f الى بيحطه فى اخر الفايل suffix ميزودش جزء ال 
            resource_type: "image",
        })
    }
    if (password !== cpassword) {
        throw new Error("invalid password", { cause: 400 });
    }

    if (await db_service.find_one({ model: userModel, filter: { email } })) {
        throw new Error("email already exist", { cause: 409 });
    }

    const user = await db_service.create({
        model: userModel,
        data: {
            userName,
            email,
            password: Hash({ plainText: password, salt_rounds: salt_rounds }),
            gender,
            phone: encrypt(phone),
            profilePicture: req.file ? { secure_url, public_id } : null
            //profilePicture: req.file.path, /single
            // profilePicture : req.files.attachment[0].path, // path خد اول فايل  منه ال attachment2بتاعه اسمه fieldname خد الفايل الى & fileds , maxcount = 1 
            // coverPicture: arr_paths 
        }
    })

    sendEmail({
        to: email,
        subject: "welcome to saraha app",
        html: `<h1> welcome ${userName} to saraha app your otp is ${otp} </h1>`
    })

    successResponse({ res, statusCode: 201, message: "success singup", data: user })
}

export const signUpWithGmail = async (req, res, next) => {
    const { idToken } = req.body

    const client = new OAuth2Client()

    const ticket = await client.verifyIdToken({
        idToken,
        audience: "290796647636-1hkdhf1vvrjv4nerm3k9rtaqpmjtfsq5.apps.googleusercontent.com"
    })

    const payload = ticket.getPayload() // الداتا الى بدخلها 
    const { email, email_verified, name, picture } = payload

    let user = await db_service.find_one({ model: userModel, filter: { email } })
    if (!user) {
        user = await db_service.create({
            model: userModel,
            data: {
                email,
                confirmed: email_verified,
                userName: name,
                profilePicture: picture,
                provider: enums.providerEnum.google
            }
        })
    }

    if (user.provider == enums.providerEnum.system) {
        throw new Error("please log in on system only", { cause: 400 });

    }
    const access_token = generate_token({
        payload: {
            id: user._id, email: user.email
        },
        secret_key: secret_key,
        options: {
            expiresIn: 60 * 2,
            //     notBefore: 60 ,// sec
            //     audience: "http://localhost:4000",
            //     issuer: "http://localhost:3000"
            // 
        }
    })

    successResponse({ res, statusCode: 201, message: "success singup by google", data: user })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const user = await db_service.find_one({ model: userModel, filter: { email } })
    if (!user) {
        throw new Error("user not exist", { cause: 400 });
    }
    if (!compareHash({ plainText: password, hashText: user.password })) {
        throw new Error("invalid password", { cause: 400 });
    }

    const jwt_id = randomUUID() // create unique id for each token

    const access_token = generate_token({ // create access token
        payload: {
            id: user._id, email: user.email
        },
        secret_key: secret_key,
        options: {
            expiresIn: 60 * 20,
            //     notBefore: 60 ,// sec
            //     audience: "http://localhost:4000",
            //     issuer: "http://localhost:3000"
            jwtid: jwt_id
        }
    })

    const refresh_token = generate_token({ // create refresh token 
        payload: {
            id: user._id, email: user.email
        },
        secret_key: refresh_secret_key,
        options: {
            expiresIn: "1y",
            jwtid: jwt_id //سوا expire عشان اما يطلع الاتنين يبوظوا 

        }
    })
    successResponse({ res, statusCode: 201, message: "success signIn", data: { user, access_token, refresh_token } })
}

export const getProfile = async (req, res, next) => {// انت متسجل عندى اصلا وبتبعتلى توكين عشان اقدر اجيب البروفايل بتاعك من خلال التوكين الى انت بعتهولى 
   
    const key = `profile :: ${req.user._id}`
    
    console.log("from cash");
    const userExist = await getValue(key)// هل البروفايل موجود عندى فى الكاش ولا لا
    
    if(userExist){
        return successResponse({ res, statusCode: 201, message: "success profile from cache", data: userExist })//لو موجود هيرجعهولى
    }//لو لا هيجيبه من الداتابيز ويخزنه فى الكاش عشان المرات الجاية لو حد طلب البروفايل بتاعه يجيبه من الكاش اسرع
    console.log("from db");
    await setValue({key, value:req.user, ttl:60})// 1 min cache in redis
        successResponse({ res, statusCode: 201, message: "success profile", data: req.user })
}

// يعنى نهال عايزه بروفايل حبيبه فانا هاخده كوبى ابعته لنهال فنهال تقدر تدخل عليه 
//share profile دا لينك ببدا generate it  بحط فيه id user عشان اما حد يدوس عليه يدخل على profile user 
export const shareProfile = async (req, res, next) => {// انت متسجل عندى اصلا وبتبعتلى توكين عشان اقدر اجيب البروفايل بتاعك من خلال التوكين الى انت بعتهولى 
    const { id } = req.params
    const user = await db_service.find_by_id({ model: userModel, filter: { _id: id }, select: "-password" })
    if (!user) {
        throw new Error("user not exist", { cause: 400 });
    }
    user.phone = decrypt(user.phone) // عشان يفك تهيش الرقم ويظهرلى الرقم عادى0120 00 00 000 

    successResponse({ res, data: user })
}

// api الى هيبعتلى عليها ال refresh token عشان يقدر generate access token جديد
export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers // token جايلى من الهيدر 
    if (!authorization) {
        throw new Error("token not exist");
    }

    const token = authorization.split(" ")[1]//[bearer,token]
    const decoded = verify_token({// بفكه بال signature الى انا كنت create بيه ال refresh token 
        token: token,
        secret_key: refresh_secret_key,
        options: {
            ignoreExpiration: true // التوكين expire تجاهل  --> options عباره عن 
        }
    })
    if (!decoded || !decoded?.id) {//token مفيهوش id
        throw new Error("invalid token");
    }
    const user = await db_service.find_one({ model: userModel, filter: { _id: decoded.id }, select: "-password" });//select:"-password" لانه متهيش فملوش لازمه يظهر password هاتلى كل الداتا ماعدا ال 
    if (!user) {
        throw new Error("user not found", { cause: 404 });
    }

    const revokeToken = await db_service.find_one(
        {
            model: revokeTokenModel,
            filter: { tokenId: decoded.jti }
        }) // decoded.jti --> token id
    if (revokeToken) {
        throw new Error("token expired")
    }

    const access_token = generate_token({ // create access token
        payload: {
            id: user._id, email: user.email
        },
        secret_key: secret_key,
        options: {
            expiresIn: 60 * 2
        }
    })

    successResponse({ res, data: access_token })

}

export const updateProfile = async (req, res, next) => {// Eng.ali
    
    let { userName, gender, phone, age } = req.body

    if (phone) {
        phone = encrypt(phone)
    }
    
    const user = await db_service.find_and_update({
        model: userModel, filter: { _id: req.user._id },
        update: { userName, gender, phone, age }, options: { new: true }// عشان يرجعلى الداتا بعد التحديث   
    })
    if (!user) {
        return next(new Error("user not exist"))
    }
    deleteKey(`profile :: ${req.user._id}`) // عشان امسح البروفايل القديم من الكاش واعمل update للبروفايل من جديد فى الكاش عشان لما حد يطلب البروفايل بتاعه يجيبه من الكاش اسرع
    return successResponse({ res, message: "profile updated successfully", data: user})
}

export const updatePassword = async (req, res, next) => {//  Eng.ali
    let { oldPassword, newPassword } = req.body

    if (!compareHash({ plainText: oldPassword, hashText: req.user.password })) {
        throw new Error("invalid old password", { cause: 400 });
    }
    const newPasswordHash = Hash({ plainText: newPassword, salt_rounds: salt_rounds })
    req.user.password = newPasswordHash
    await req.user.save()// عشان احفظ التغيرات الى حصلت على ال password
    successResponse({ res, message: "password updated successfully" })

}

export const logout = async (req, res, next) => { //هل انت عايزه يخرج من كل الاجهزه ولا من جهاز معين ؟ 

    const { flag } = req.query
    if (flag === "all") {// logout from all devices 

        req.user.changeCredential = Date.now() //logout  وقت ال  update  اعمل
        await req.user.save()

        await deleteKey(await keys(get_token({ userId: req.user._id }))) //keys revoke_token::485632586586* == keys name* عشان يمسح كل التوكينات الى تخص اليوزر دا 
        //db_service.delete_many({ model: revokeTokenModel, filter: { userId: req.user._id } }) //   احذف كل التوكينات الى موجوده عندى فى الداتابيز  تخص اليوزر دا عشان خلاص هو خرج من كل الاجهزه

    } else {//هخزن عندى معلومات revoketoken دا 
        await setValue({
            key:revoke_prefix({ userId:req.user._id,tokenId:req.decoded.jti}), // revoke_token::485632586586=userId ::21485254865324=tokenId
            value:`${req.decoded.jti}`,
            ttl: `${req.decoded.exp - Math.floor(Date.now() / 1000)}` // expired time - current time & floor 5.5 = 5 & /1000 convert to second
        })}
    successResponse({ res, message: "logout successfully" })
}
 //else دا اخر جزء فى ال logout--> await db_service.create({// بخزن فى الداتا بيز 
        //     model: revokeTokenModel,
        //     data: {
        //         tokenId: req.decoded.jti,
        //         userId: req.user._id,
        //         expireAt: new Date(req.decoded.exp * 1000)
        //     }
        // }) // *1000 = millisecond





        