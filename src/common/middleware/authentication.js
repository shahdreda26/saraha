import {verify_token} from "../utils/token.service.js"
import * as db_service from "../../db/db.service.js"
import { userModel } from "../../db/models/user.model.js"
import {secret_key} from "../../../config/config.service.js"
import {successResponse} from "../utils/response/success.response.js"
import { decrypt } from "../utils/security/encrypt.security.js"
import { revokeTokenModel } from "../../db/models/revoke.model.js"
//middleware = (req,res,next)=>{}

export const authentication =async (req,res,next)=>{
    // دا frontend  عشان ابقى عارفه ان التوكين دا جاى من الfrontend كلمه سر بينى وبين ال 
    // bearer token:بتاعى مش اكتر  security بستخدمه كزياده لل  
    const {authorization}= req.headers // token جايلى من الهيدر 
        if(!authorization){
            throw new Error("token not exist");    
        }  

    const token = authorization.split(" ")[1]//[bearer,token]
    const decoded = verify_token({
                token:token,
                secret_key: secret_key,
                options: {
                    ignoreExpiration:true // التوكين expire تجاهل  --> options عباره عن 
        }})// payload بفك التوكين والى بيرجعلى بيبقى ال 
        //invalid signature : error-->غلط  secret key  اما بعت ال 
        //secret or public key must be provided : error-->اصلا secret key اما مش ببعت 
            if(!decoded|| !decoded?.id){//token مفيهوش id
                throw new Error("invalid token");
                }// findOne--> عملناها عشان ممكن يكون عندى توكين لاكن اليوزر دا اتمسح فلازم اتاكد انه اليوزر دا موجود والتوكين شغال تمام
             
                const user = await db_service.find_one({model:userModel, filter:{_id:decoded.id},select:"-password"});//select:"-password" لانه متهيش فملوش لازمه يظهر password هاتلى كل الداتا ماعدا ال 
                    if(!user){
                        throw new Error("user not found",{cause:404});
                    }  
                successResponse({res,statusCode:201 ,message:"success login",data:{...user._doc,phone:decrypt(user.phone)}})
            
                // token expire  ومش هتشتغل على ولا جهاز خلاص --> check logout from all devices
                
                if (user?.changeCredential?.getTime()> decoded.iat*1000){ //time create token --> decoded.iat "second"  & changeCredential--> date  & getTime()--> time in millisecond & *1000 convert into millisecond
                throw new Error("token expired")//? عشان لو مفيش ميدنيش ايرور cannot read undefined getTime
             }
                // check logout from specific device
                const revokeToken = await db_service.find_one({model:revokeTokenModel,
                    filter:{tokenId:decoded.jti}}) // decoded.jti --> token id
                    if(revokeToken){      
                        throw new Error("token expired")
                    }

            req.user = user//user وحط جواه قيمه user اسمه key ال req زود فى 
            req.decoded=decoded // revoke token اجيب منه ال exp - jti
            next()// الى بعده middlewarw عشان يقدر يدخل على ال 
}
