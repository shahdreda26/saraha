import joi from "joi"
import {genderEnum} from "../../common/enum/user.enum.js"
import { general_rule } from "../../common/utils/generalRules.js"

export const signupSchema= {
    body: joi.object({
        userName : joi.string().required().min(5).trim(),
        email:general_rule.email.required(),
        password:general_rule.password.required(),// هنا بقوله ابدا على الاقل برقم وبعدين على الاقل حرف صغير وبعدين على الاقل حرف كبير واى 8 حروف واقف 
        cpassword:general_rule.cpassword.required(),
        phone:joi.string().required(),
        gender:joi.string().required().valid(...Object.values(genderEnum)),
        age:joi.number().required() }).required().messages({//بمعنى اى حاجه متعرفهاش عديها options({allowUnknown:true}) احط required() ممكن بدل ال 
        "any.required" :"body must be not empty" 
 }),
 }

export const loginSchema={
    body: joi.object({
        email:general_rule.email.required(),
        password:general_rule.password.required()
    }).required(),
    // query: joi.object({
    //     x:joi.number().min(5).max(10).required()
    // }).required(),
}

export const shareProfileSchema={
    params: joi.object({
        id:general_rule.id.required()
    }).required(),
}

export const updateProfileSchema={ // مش require عشان ممكن اطبق عليهم validation وممكن لا 
    body: joi.object({
            firstName : joi.string().min(5).trim(),
            lastName : joi.string().min(5).trim(),
            phone:joi.string(),   
            gender:joi.string().valid(...Object.values(genderEnum))  ,
            age:joi.number() 
    }).required()  //لازم احط required لانى جاى اعمل update فلازم ابعتلك حاجه منهم
    }

export const updatePasswordSchema={ 
    body: joi.object({
            oldPassword : general_rule.password.required(),
            newPassword : general_rule.password.required(),
            cpassword : joi.string().required().valid(joi.ref("newPassword"))
    }).required()
    }
      