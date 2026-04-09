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
    multer_local({custom_type:multer_mimetype.image}).single("attachment"),
    schemaValidation(uv.signupSchema)// multer لازم يكون بعد ال bodyالاول فعشان اطبق اى حاجه على ال  form data  للداتا الى جايه من نوع  handeling  بيعمل multer عشان خاطر ال multer  بحطه بعد ال 
    ,us.signUp); 

userRouter.post("/signup/gmail", us.signUpWithGmail);

userRouter.post("/signin",schemaValidation(uv.loginSchema), us.signIn); 

userRouter.get("/profile",authentication,authorization([RoleEnum.user]), us.getProfile);

userRouter.get("/refresh-token",us.refreshToken) // send refresh token return new access token 

userRouter.get("/share-profile/:id",schemaValidation(uv.shareProfileSchema),us.shareProfile)

userRouter.patch("/update-profile",authentication,schemaValidation(uv.updateProfileSchema), us.updateProfile);

userRouter.patch("/update-password",authentication,schemaValidation(uv.updatePasswordSchema), us.updatePassword);

userRouter.post("/log-out", authentication, us.logout);
