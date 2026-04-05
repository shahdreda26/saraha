
import joi from "joi"
import {Types} from "mongoose"


export const general_rule={
    email:joi.string().email({tlds:{allow:true}, minDomainSegments:2,maxDomainSegments:3}),
    password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/),
    cpassword:joi.string().valid(joi.ref("password")),

    id:joi.string().custom((value,helper)=>{
        //helper --> هرجع من خلاله الايرور
        const isvalid =Types.ObjectId.isValid(value)// ابدا اشوف هى تمام ولا لاObjectId القيمه الى جايه تكون 
        return isvalid ? value : helper.message("invalid id")
    }),//اتغير مروحش اعدل بايدى والكود يضرب قبل ما اعدل دا هتخليه يتعدل تلقائى length or type  عشان لو ال 
    
    file:joi.object({//single 
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination:joi.string().required(),
            filename:joi.string().required(),
            path:joi.string().required(),
            size:joi.number().required()
    
        }).required().messages({
            "any.required": "file is required"
        }),

}