import mongoose from "mongoose"
import {mongoo_db} from "../../config/config.service.js"
export const connectionDb =async () => {

    await mongoose.connect(mongoo_db,{serverSelectionTimeoutMS: 5000})//لو فيه مشكله بعد 5 ثوانى يضرب معايا
    .then(() => {
        console.log("DB connected successfully");
    }).catch((err) => {
        console.log("Error connecting to db:", err);
    }); 
}