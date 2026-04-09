import mongoose from "mongoose";
import * as userEnum from "../../common/enum/user.enum.js";

export const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:10,
        trim:true //بتمسحلى المسافات الخارجيه فقط انما الداخليه بتسيبها زى ما هى
},
   lastName:{
        type:String,
        required:true,
        minlength:3,//اقل عدد حروف 3
        maxlength:20,// اكبر عدد حروف 10
        trim:true   
},// time logout > time generate token then token is expired 
// any token generated before logout will be expired after logout 
    changeCredential: Date, // بالضبط logout بالوقت الى عملت بيه update 
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true 
},
password:{
        type:String,
        required:function(){//this = schema &  : = else 
            return this.provider == userEnum.providerEnum.google ? false : true
        },
        trim:true 
},
    age:Number,
    phone:String,
    gender:{
            type:String,
            enum:Object.values(userEnum.genderEnum),//هنا انا عشان وانا شغال ممكن اعدل فى value 
           //Object.keys(userEnum.genderEnum) وانا شغال هنا هبقى بعدل فى ال keys 
            default:userEnum.genderEnum.male
},
    // profilePicture:String,
    profilePicture:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true}
    },

    coverPicture:[{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true}
    }],//عشان بياحد منى اكتر من صوره فحطناهم فى ارااى
    confirmed:Boolean,  //الى انا بعتهولك هتاكد ان الايميل حقيقى otp  عشان نتاكد ان الايميل دا ايميل حقيقى بمجرد ما يضغطعلى على اللينك او تكتبلى ال otp احنا هنبدا نبعتلهsignup اما الشخص يعمل 
    provider:{
        type:String,
        enum:Object.values(userEnum.providerEnum),
        default:userEnum.providerEnum.system
},
    role:{
    type:String,
    enum:Object.values(userEnum.RoleEnum),
    default:userEnum.RoleEnum.user
}
},
    {
    timestamps:true, //CreatedAt, UpdatedAt
    strictQuery:true ,// لو بدور على فيلد مش موجود بيعتبره مش موجود بيوقعه وبيدور فى باقى الاسكيما 
    toJSON:{virtuals:true}, // عشان يظهرلى القيم الvirtualزى الuserName
})

userSchema.virtual("userName")
    .get(function(){
        return this.firstName +" "+ this.lastName
})
    .set(function(value){
        const [firstName,lastName] = value.split(" ")//split() return array 
        this.firstName = firstName
        this.lastName = lastName
}) 

export const userModel =mongoose.models.user|| mongoose.model("user",userSchema)//عملت ||عشان لو موجود عندى قبل كدا ميضربش ايرور