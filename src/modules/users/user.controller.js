import express from 'express';
import * as us from  "./user.service.js"
import { authentication } from '../../common/middleware/authentication.js';
import { authorization } from '../../common/middleware/authorization.js';
import { RoleEnum } from '../../common/enum/user.enum.js';
import {schemaValidation} from "../../common/middleware/validation.js"
import * as uv from "./user.validation.js"
import {multer_local,multer_host} from "../../common/middleware/multer.js"
import { multer_mimetype } from '../../common/enum/multer.enum.js';
export const userRouter = express.Router();

userRouter.post("/signup",
    //multer_local({custom_type:[...multer_mimetype.image,...multer_mimetype.pdf]})
    multer_host(multer_mimetype.image).single("attachment")
    ,us.signUp); //fields -->array of object  بتاخد منى  --> return object فيه مجموعه من ال keys وكل واحد منهم يكون array of object 
//.single("attachment")--> attachment "field name"--> postmanدا الى هحطه فى ال - attachment لو كتبته غلط هيدينى Unexpected field
//.fields([{name:"attachment1",maxCount:2},{name:"attachment2",maxCount:1}])
//.array("attachments",2)-->2 -->maxcount --> return array 

userRouter.post("/signup/gmail", us.signUpWithGmail);

userRouter.post("/signin", us.signIn); 
userRouter.get("/profile",authentication,authorization([RoleEnum.user]), us.getProfile);


// regular expression : هى طريقه بكتب بيها نمط معين عشان اتاكد ان البيانات الى داخله مطابقه للنمط دا 
//https://regex101.com
// / pattern /
// a -->فى اى حته عادى a النص لازم يبقى فيه حرف ال   
// a|b|c = [abc] --> النص لازم فيه حرف من التلاته دول فى اى حته 
//[a-z] , [A-Z] , [0-9] --> اى حرف كبير او صغير او رقم 
//[01-9]--> احط رقم 0 او من 1 الى 9 
//[019]--> حط اى رقم من التلاته دول 
// web[a-z] -->small وبعدها اى حرف web حط كلمه 
//[web][a-z]-->small وبعدين اى حرف web حط اى حرف من حروف كلمه 
//[1-7][0-9]|80 --> range 10 to 80 
//^a -->a لازم الكلام يبدا بحرف ال
//^[a-z]--> small لازم يبدا باى حرف 
//^[a-z][A-Z]--> capital وبعده يجى اى حرف small لازم يبدا باى حرف 
//a$ --> وبعده متكملش aانهى الكلام بحرف ال 
//^a[A-Z]{5}$ -->ومتكملش capital وبعده يجى اى 5 حروف  a لازم الكلام يبدا بحرف ال
//{5,7}--> هاتلى 5او 6او 7 حروف "range"
//{5,} --> هاتلى من 5 حروف وطالع 
//{0,} = * --> zero or more
//{1,} = +--> one or more
//{0,1} = ? --> zero or one
//web design?--> return web design or web desig
//web (design)?--> web design or web 
// . -->  anything 
// \ عشان احط حاجه زى ما هى 
// \$ --> 50$
//^[^0-9] --> اى رقم ميكونش من 0 ل 9 
// \s --> space 
// \S -->space اى حاجه غير 
// \d --> any digit from 0 to 9
// \D --> anything not from 0 to 9
// \w -->special character  ماعدا الanything
// \W --> any special character
// ^(0020|010|\+20)1[0125][0-9]{8}$ --> phone number 
// web\s --> واخلى البرنامج global -->"web " هاتلى اى 
//web[a-z]-->واخلى البرنامج insensitive [a-z] or [A-Z]
// multiline --> check على كل سطر 
//let x = "shahd reda farag".replace(/\s/g,"-")  حول اى مسافه--> shahd-reda-farag