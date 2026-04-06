
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
// هنا ممكن يحصل شويه delay
revokeTokenSchema.index({expireAt:1},{expireAfterSeconds:0})//expireAt index 1 ascending  & expireAfterSeconds:0 --> expireAt time comes then the document will be deleted automatically

export const revokeTokenModel = mongoose.model("revokeToken",revokeTokenSchema) 

// redis : dectionary server --> external server --> تعتبر key-value based --> بتركز على cashing
//كتير و بستخدمها كتير جدا requests بستخدمه اما الداتا بتاعتى مش بتتغير كتير وفى نفس الوقت بيجى عليها 
// زى نون هل المنتجات هتتغير كل كام دقيقه لا طبعا 
// redis -->بخزن فيه الداتا الى بتتغير كل فتره فاما يجى الطلب ب يدور فيها قبل ما يروح لداتا بيز  storage
//  يقلل الضغط على الداتا بيز بتاعتنا performance هيزود ال cashing
// redis io.com --> login --> resources --> tutorials --> search cheat sheet & بيوفرلى 25 mb & upstash redis دا اقدر اخزن عليه  بيوفرلى 250 
// sets in redis = array
