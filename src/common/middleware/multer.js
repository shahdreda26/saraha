import multer from "multer"
import fs from "fs"


export const multer_local=({custom_path="General",custom_type=[]} = {})=>{//{ } = {} عشان اقدر ادخل حاجه منهم مش شرط الاتنين

    const full_path = `uploads/${custom_path}`

    if(!fs.existsSync(full_path)){//ليه وبعدين تكمل الكودcreate بتشوف هل الفولدر دا موجود لو موجود بتكمل الكود لو لا ب
        fs.mkdirSync(full_path,{recursive:true})//تتبعت api  بيتكون اول ما برن الكود تلقائى مش بيستنى ال 
    }//{recursive:true} " upload/users/admin "sub foldersليه ودى بتدينى اماكنيه اعمل فولدر وجواه create  الباث لو مش موجود من الاول ب

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {// المكان الى هخزن فيه الفايل بعد ما هرفعه - cb: call back - file: بيانات عن الفايل قبل ما اعرفه
        console.log(file,"---------before upload--------")  
        cb(null, full_path)// المكان الى هخزن فيه الفايل -->'uploads' 
      },//foldersالشغل بتاعى الى مجموعه من ال uploads هقسم جوه فولدر ال 

      filename: function (req, file, cb) {// اسم الفايل بعد ما هرفعه
        console.log(file,"-----------before upload------------")  
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)// unique name--> بحيث هحطه فى البدايه"لان لو فى النهايه الامتداد هيروح هيبقى اخر المسار رقم"  فكل مره اسم الفايل هيبقى راندم فمختلفover write دا بيحل مشكله ال
        cb(null,uniquePrefix+ "_" + file.originalname)// file.originalname  اسم الفايل بعد ما هخزنه وهنا بقوله سميه نفس اسم الفايل الى موجود عندى على الجهاز 
      }//مش هيدينى ايرور بس الصوره مش هتفتح لانه مش عارف الامتداد بتاعها لاكن بيدينى اى اسم راندم من عنده filename لو معطتهوش ال 
})//فبيبقى عندى اول فايل بس overwrite اما برفع فايل فى نفس الفولدر بنفس الاسم بيتعمل عليه 
  
  
  function fileFilter (req, file, cb) { //هنا عشان احدد نوع الفايلات الى عيزاها عندى 
    //console.log(file) //  الصح mimetype عشان اخد منه ال 
    if(!custom_type.includes(file.mimetype)){

      return cb(new Error("invalid file type"),false);
    }
  cb(null,true)
}

  const upload = multer({ storage,fileFilter})//مش هيفرق object الترتيب فى ال 
  return upload
}

export const multer_host=(custom_type=[])=>{

  //عملت كدا عشان متتخزنش عندى فى الجهاز زى ما قولنا كدا بتتخزن فى temp
  const storage = multer.diskStorage({ })//عشان بتعامل مع سيرفر خارجى وانا عايز اخد ال path 
 
  function fileFilter (req, file, cb) { 
    console.log(file) 
    if(!custom_type.includes(file.mimetype)){
      cb(new Error("invalid file type"));
    }
  cb(null,true)
}

  const upload = multer({ storage,fileFilter})
  return upload
}


