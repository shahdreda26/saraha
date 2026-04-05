import joi from "joi"
import {genderEnum} from "../../common/enum/user.enum.js"
import { general_rule } from "../../common/utils/generalRules.js"

export const signupSchema= {
    body: joi.object({
        userName : joi.string().required().min(5).trim(),//.min(5).max(20),//if min(5)اقل عدد حروف  & max(5)اكبر عدد حروف  --> length(5)عدد الحروف لازم يبقى 5
        //alphanum()--> 0-9 or a-z or A-Z  & empty("") لو عايزه يبقى فاضى & default("ali") لو مدخلتهوش اديله قيمه تلقائيه & valid("ali") الاسم لازم يكون القيمه دى واى حاجه غيرها غلط & insensitive() --> capital or small مش هيفرق الاسم الى هدخله سواء كان & by default is sensitive() & not("ali") اى حاجه ادخلها غير القيمه دى 
        //uppercase():lowercase() و زيها ال capital هتحولهالى small يعنى لو دخلت القيمه  validation وليس transformation عباره عن 
        // required & empty مينفعش يبقوا مع بعض 
        email:general_rule.email.required(),// email() --> shahd@gmail.com  
        //TLD --> top level domain -->.email({tlds:{allow:true}}) -->LANA عديلى اى حاجه من الى فى ال 
        //.email({tlds:{allow:["com","outlook"]}})--> هنا بقوله عديلى دول فقط 
        //.email({tlds:{allow:false ,deny:["org"]}}) org عدى كله ماعدا 
        //.email({tlds:{allow:true}, minDomainSegments:2})على الاقل يكون 2 ".com.org" & maxDomainSegments:3
        password:general_rule.password.required(),// هنا بقوله ابدا على الاقل برقم وبعدين على الاقل حرف صغير وبعدين على الاقل حرف كبير واى 8 حروف واقف 
        // ?=.* --> at least //.length(8).messages({
        //     "any.required":"password must not be empty",//  "string.min" & "any.required" are type error  
        //     "string.min": "password is too short"//  بهندل شكل الايرور زى ما انا عايزه على حسب نوعه بحط رساله مناسبه تفهمنى 
        // }),
        cpassword:general_rule.cpassword.required(),//valid(joi.ref("password"))-->بحيث تبقى زيها password  فكانى بقوله شاور على قيمه ال password هى هى قيمه cpassword يعنى خلى قيمه ال 
        phone:joi.string().required(),
        gender:joi.string().required().valid(...Object.values(genderEnum)),//.valid(genderEnum.female,genderEnum.male),
        //عشان اتعامل مع ال enums : valid(genderEnum.female,genderEnum.male)  or valid(...Object.values(genderEnum))
        age:joi.number().required() }).required().messages({//بمعنى اى حاجه متعرفهاش عديها options({allowUnknown:true}) احط required() ممكن بدل ال 
        //options({presence:"required"})required كلمه field  بدل ما اعمل جنب كل - items(joi.object({name:joi.string(), age:joi.number()}).required())--> array of object 
        "any.required" :"body must be not empty" 
 }),//.with("password","cpassword") required معناها ان لازم الاتنين يجوا مع بعض حتى لو مش  & or("password","cpassword") معناها ابعت دا او دا او الاتنين لاكن لازم يبعت واحد فيهم على الاقل //.min(18).max(60),//اقل سن يبقى 18 واكبر سن يبقى 60 - less(40) العمر لازم يكون اقل من 40
        //integer() - negative() الرقم الى داخل لازم يبقى سالب- positive() الرقم الى داخل لازم يبقى موجب- port() "0:65535" بتدينى رقم - multiple(2)" مضاعفات الرقم" 2-4-6-8 - precision(2) قرب الارقام العشريه لاقرب رقمين2.555-->2.56 
        //-->flag:joi.boolean(),//truthy("y","1","yes","ok") -->true كل دول هيدوا & falsy("0","n","no","f")-->false كل دول هيدوا & insensitive -->"by default" falsy & truthy مع ال & sensitive() عشان تاخد القيم جواهم زى ما مكتوبه بالضبط 
        //-->DOB:joi.date(),//"2026-03-21" - greater("2026-03-23") "2026-03-23 8:12" لازم يبقى اكبر من انهارده يعنى بكره دا لو دخلته كتاريخ بس طب لو حطيتله وقت يبقى عادى ممكن نفس اليوم بس بعد الوقت الى انا فيه - 
        // greater("now")برضو بس بيبقى من انهارده ونازل less كدا انا اجبرته يبقى اكبر من انهارده عموما لازم يبقى بكره ونفس الكلام على 
    //     user:joi.object({
    //         name:joi.string().required(),
    //         age:joi.number()
    //     }).required().length(2)//key فيه كام object  اتحكم يبقى عندى جوه ال &  min(2)--> at least 2 two key "على الاقل احط 2" &
    // }),
   // users: joi.array().required().items(joi.number()),//array كدا انا حددت نوع القيم الى هتدخل جوه ال
    //.items(joi.number(),joi.string())خلى القيم الى تدخل ارقام او حروف 
    //.length(2) خلى القيم الى جوه الارااى قيمتين فقط  - ordered(joi.number(),joi.string()) لازم الاول يبقى رقم والتانى يبقى حروف
    //client: joi.object().valid(joi.in("users"))//او غيره object() - string() لازم الاتنين يبقوا من نفس النوع سواء  users لازم قيمته تكون واحده ضمن قيم ال 
    //client: joi.string().valid(joi.ref("users.name1"))string()لازم قيمته تكون قيمه الاسم الاول ونوعه يبقى نفس نوع الاسم 
    // xor("password","cpassword") ابعتلى واحد من الاتنين لاكن مينفعش تبعت الاتنين مع بعض 
    file:general_rule.file.required(),

   // files: joi.array().items(general_rule.file.max(2).required()).required()//array

//     files: joi.object({// fields 
//         attachment:joi.array().items(general_rule.file.required()).max(1).required(),
//         attachments: joi.array().items(general_rule.file.required()).max(3).required()
//     }).required()
 }

export const loginSchema={
    body: joi.object({
        email:general_rule.email.required(),
        password:general_rule.password.required().length(8)
    }).required(),

    query: joi.object({
        x:joi.number().min(5).max(10).required()
    }).required(),
}

export const shareProfileSchema={
    params: joi.object({
        id:general_rule.id.required()
    }).required(),
}