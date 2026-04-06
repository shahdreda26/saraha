
import mongoose from "mongoose";


export const revokeTokenSchema = new mongoose.Schema({
    tokenId:{
        type:String,
        required:true,
        trim:true
    },
    userId:{ 
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user" // عشان اعمل relation بين ال revoke و ال user
    }   ,
    expireAt:{
        type:Date,
        required :true,
    }   
 } ,
    {
    timestamps:true, //CreatedAt, UpdatedAt
    strictQuery:true ,// لو بدور على فيلد مش موجود بيعتبره مش موجود بيوقعه وبيدور فى باقى الاسكيما 
} )

revokeTokenSchema.index({expireAt:1},{expireAfterSeconds:0})//expireAt index 1 ascending  & expireAfterSeconds:0 --> expireAt time comes then the document will be deleted automatically

export const revokeTokenModel = mongoose.model("revokeToken",revokeTokenSchema) 
