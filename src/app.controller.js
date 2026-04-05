import express from "express";
import { connectionDb } from "./db/connection_db.js";
import { userRouter } from "./modules/users/user.controller.js";
import {Port}  from "../config/config.service.js"
import cors from "cors"
const app = express();
const port = Port;

export const bootstrap = async () => {
    app.use(cors())//بستخدمها عشان اسمح للفرونت ياكسس كود الباك 
    app.use("/uploads",express.static("uploads"))// "config - image - html -..." زى <--"path as relative path" url عشان اقدر اتعامل معاها كانها apis بستخدمها مع الحاجات الثابته الى موجوده على الجهاز عندى يعنى الى ملهاش  
    //واتعامل معاه uploads ادخل جوه فولد ال /uploadsهنا بقوله اى حاجه على 
    app.use(express.json());//multer انا مش بستخدم فيها الapis الاول طب انا هخليه ليه لان عندى body بيهندل الداتا الى جايه من الmulter لان multer ممكن الغيه فى وجود ال 
    app.use("/users", userRouter);
   
    app.get("/", (req, res) => {
        res.json("welcom to saraha app");
    });

    await connectionDb();

    app.use((err, req, res, next) => {//global error
        res.status(err.cause||500).json({ message: err.message,stack: err.stack });//err.cause-->status code  بتدينى رقم ال 
    });
    app.listen(port, () => {
        console.log(`app running on port ${port}`);
    });
}