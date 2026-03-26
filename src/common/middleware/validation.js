

export const schemaValidation =(schema)=>{//schema--> api هتيقى عندى متغيره فى كل مره على حسب ال
    
    return (req,res,next)=>{
        console.log(Object.keys(schema))//this code return []
        let error_result=[]
        for (const key of Object.keys(schema)) {//loop schema-->schema is object "عشان اقدر ادخل داتا من اكتر من طريقه عادى مبقاش مقيده body - query - ..."
             const {error}= schema[key].validate(req[key],{abortEarly:false})
            if(error){
                error.details.forEach(element => {
                    error_result.push({
                        key,
                        path:element.path[0],// [0] من غير ال --> array هتدينى & path[0]-->array فكدا بقوله ادينى اول قيمه فى ال
                        message:element.message
                    })
                });
               // error_result.push(error.details)// عشان يكمل اللوب للاخر حتى لو فيه ايرور ويظهر كل الايرور مره واحده 
            }//[[{}]]--> [] فانا عشان الاشى كل دا واخلى --> forEach هعمل 
       }
        if(error_result.length >0){
           return res.status(400).json({message:"validation error", error:error_result})
       }
        next()
        }
} 



