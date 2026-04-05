import * as enums from "../../common/enum/user.enum.js"
import {successResponse} from "../../common/utils/response/success.response.js"
import {encrypt,decrypt} from "../../common/utils/security/encrypt.security.js"
import {Hash,compareHash} from "../../common/utils/security/hash.security.js"
import {generate_token,verify_token} from "../../common/utils/token.service.js"
import * as db_service from "../../db/db.service.js"
import { userModel } from "../../db/models/user.model.js"
import { OAuth2Client } from "google-auth-library"
import {refresh_secret_key, salt_rounds,secret_key} from "../../../config/config.service.js"
import cloudinary from "../../common/utils/cloudinary.js"


export const signUp = async (req,res,next)=>{
    const {userName,email,password,cpassword,gender,phone}=req.body
    //console.log(req.file,"--------after upload -------")//single
    // console.log(req.files,"--------after upload -------") // fields - array 

    //----> وانا شغال local multer
    // if(!req.file){//validation file in file user.validation.js بدل دا هروح اعمل 
    //     throw new Error(" file is required");
        
    // }

    const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path,{// await --> error promise
        folder:"saraha_app/users",// if folder exist add photo if not exist create it
        //public_id:"shahd" //overwrite دا مش كويس لانه بيرجعنى ل
        use_filename:true ,// public_id ك filename هيستخدم اسم -->"ef028a1731199938d6c36d144896488e_y2yt6f"
        unique_filename:false ,// _y2yt6f الى بيحطه فى اخر الفايل suffix ميزودش جزء ال 
        resource_type:"image",
    })//req.file.path= file"string"
    //data return info about file --> public_id :ودا اقدر اتحكم فيه cloudinary اسم الصوره على 
                                    // asset_id :cloudinary الصوره دى فى  id دا انا مقدرش اتحكم فيه ودا يعتبر ال 
                                    //format = mimetype   & resource_type = "audio - image by default as backend - vedio - auto by default as frontend --> anything - row --> pds "
                                    //url & secure_url =path بتاع الصوره  & secure_url - public_id دول الى هخزنهم عندى فى الداتا بيز
    // let arr_paths=[]// array 
    // for (const file of req.files) { // وضيفه فى الارااى دى path عدى على كل الفايلات خد منهم ال
    //     arr_paths.push(file.path)
    // }

    //  let arr_paths=[]// fields الى فيه maxcount > 1 
    // for (const file of req.files.attachments) { //    path  وخد منها الattchment1 عدى على كل الفايلات الى فيها  
    //     arr_paths.push(file.path)
    // }

    // await cloudinary.uploader.destroy()// remove file from cloudinary
    // await cloudinary.api.delete_folder()//remove folder from cloudinary
    // await cloudinary.api.delete_resources_by_prefix()// بتفضى الفولدر 

    if(password!==cpassword){
        throw new Error("invalid password",{cause:400});
    }

    if(await db_service.find_one({model:userModel,filter:{email}})){
        throw new Error("email already exist",{cause:409}); 
    }

    const user = await db_service.create({
        model:userModel,
        data:{
            userName,
            email,
            password:Hash({plainText: password,salt_rounds:salt_rounds}),
            gender,
            phone: encrypt(phone),
           profilePicture: {secure_url,public_id}
            //profilePicture: req.file.path, /single
            // profilePicture : req.files.attachment[0].path, // path خد اول فايل  منه ال attachment2بتاعه اسمه fieldname خد الفايل الى & fileds , maxcount = 1 
            // coverPicture: arr_paths 
        }
    })

    successResponse({res,statusCode:201 ,message:"success singup",data:user})
}

export const signUpWithGmail= async (req,res,next)=>{
    const {idToken}=req.body

    const client = new OAuth2Client()

    const ticket = await client.verifyIdToken({
        idToken,
        audience: "290796647636-1hkdhf1vvrjv4nerm3k9rtaqpmjtfsq5.apps.googleusercontent.com"
    })

    const payload= ticket.getPayload() // الداتا الى بدخلها 
    const {email,email_verified,name,picture} = payload

    let user =await  db_service.find_one({model:userModel,filter:{email}})
    if(!user){
        user = await db_service.create({
           model:userModel,
           data:{
                email,
                confirmed:email_verified,
                userName:name,
                profilePicture:picture,
                provider: enums.providerEnum.google}         
        })
    }

    if(user.provider==enums.providerEnum.system){
        throw new Error("please log in on system only",{cause:400});
        
    }
    const access_token = generate_token({
        payload:{
            id:user._id,email:user.email
        },
        secret_key:secret_key,
        options:{
            expiresIn:60*2,
        //     notBefore: 60 ,// sec
        //     audience: "http://localhost:4000",
        //     issuer: "http://localhost:3000"
        // 
        }
    })

    successResponse({res,statusCode:201 ,message:"success singup by google",data:user})
}

export const signIn =async (req,res,next)=>{
    const {email,password}=req.body
    const user=await db_service.find_one({model:userModel,filter:{email}})
    if(!user){
        throw new Error("user not exist",{cause:400});
    }
    if (! compareHash({plainText:password,hashText:user.password})){
        throw new Error("invalid password",{cause:400});
    }
    const access_token = generate_token({ // create access token
        payload:{
            id:user._id,email:user.email
        },
        secret_key:secret_key,
        options:{
            expiresIn:60*2,
        //     notBefore: 60 ,// sec
        //     audience: "http://localhost:4000",
        //     issuer: "http://localhost:3000"
        // 
        }
    })

    const refresh_token = generate_token({ // create refresh token 
        payload:{
            id:user._id,email:user.email
        },
        secret_key:refresh_secret_key,
        options:{
            expiresIn:"1y"
        
        }
    })
     successResponse({res,statusCode:201 ,message:"success signIn",data:{user,access_token,refresh_token}})
}

export const getProfile = async(req,res,next)=>{// انت متسجل عندى اصلا وبتبعتلى توكين عشان اقدر اجيب البروفايل بتاعك من خلال التوكين الى انت بعتهولى 
   
      successResponse({res,statusCode:201 ,message:"success signIn profile",data:req.user})
}

// يعنى نهال عايزه بروفايل حبيبه فانا هاخده كوبى ابعته لنهال فنهال تقدر تدخل عليه 
//share profile دا لينك ببدا generate it  بحط فيه id user عشان اما حد يدوس عليه يدخل على profile user 
export const shareProfile = async(req,res,next)=>{// انت متسجل عندى اصلا وبتبعتلى توكين عشان اقدر اجيب البروفايل بتاعك من خلال التوكين الى انت بعتهولى 
    const {id} = req.params 
    const user=await db_service.find_by_id({model:userModel,filter:{_id:id},select:"-password"})
    if(!user){
        throw new Error("user not exist",{cause:400});
    }           
       user.phone = decrypt(user.phone) // عشان يفك تهيش الرقم ويظهرلى الرقم عادى0120 00 00 000 

      successResponse({res,data:user})
}
// api الى هيبعتلى عليها ال refresh token عشان يقدر generate access token جديد
export const refreshToken = async(req,res,next)=>{
   const {authorization}= req.headers // token جايلى من الهيدر 
           if(!authorization){
               throw new Error("token not exist");    
           }  
   
       const token = authorization.split(" ")[1]//[bearer,token]
       const decoded = verify_token({// بفكه بال signature الى انا كنت create بيه ال refresh token 
                   token:token,
                   secret_key: refresh_secret_key,
                   options: {
                       ignoreExpiration:true // التوكين expire تجاهل  --> options عباره عن 
           }})
               if(!decoded|| !decoded?.id){//token مفيهوش id
                   throw new Error("invalid token");
                   }
                const user = await db_service.find_one({model:userModel, filter:{_id:decoded.id},select:"-password"});//select:"-password" لانه متهيش فملوش لازمه يظهر password هاتلى كل الداتا ماعدا ال 
                       if(!user){
                           throw new Error("user not found",{cause:404});
                       }  

                const access_token = generate_token({ // create access token
                    payload:{
                        id:user._id,email:user.email
                    },
                    secret_key:secret_key,
                    options:{
                        expiresIn:60*2 
                    }
                })
                   
      successResponse({res,data:access_token})

}