//عشان لو عايزه اغير اللغه من واحده للتانيه وكمان عشان لو عندى سطر كود متكرر اقدر لو عايزه اعدل عليه اعدل عليه مره واحده بدل ما اروح لكل حته واعدلها
    //example : findOne بستخدمها ياما وبكررها كتير 
export const create= async ({model,data}={}) => {// {model,data}={} عشان اقدر ادخل حد من الاتنين مش شرط الاتنين مع بعض
    return await model.create(data);
 }   

 
export const find_one= async ({model,filter={},options={},select=""}={}) => {//filter={}--> عشان لو مدخلتش حاجه ميدينش ايرور
   const doc =  model.findOne(filter);
    if(options.populate){
         doc.populate(options.populate);//  بتظهرلى معلومات البوست مثلا وكل ما يخص اليوزر دا join زى ال 
    }
    if(options.skip){
        doc.select(options.skip);//هنا بديله رقم فكانى بقوله عدى اول 2 يوزر وهات من بعدهم 
    }
    if(options.limit){
        doc.select(options.limit);// هنا بديله رقم فكانى بقوله هاتلى اول 10 يوزر 
    }
    if(select){
        doc.select(select);
    }

    return await doc.exec();//نفذلى الكلام دا كله بقى
 }  


export const update_one= async ({model,filter={},update={},options={}}={}) => {
   const doc =  model.updateOne(filter,update,{runValidators:true,...options});//runValidators-->لو اى شرط مش متحقق هيدينى ايرورmax - min - required - enum زى ال Validation بتتحقق من ال
    return await doc.exec();
 }  


export const find_and_update = async ({model,filter={},update={},options={}}={}) => {
   const doc =  model.findOneAndUpdate(filter,update,{new:true,runValidators:true,...options});//new:true--> return data after update
    return await doc.exec();
 }  


 export const find_by_id= async ({model,filter={},options={},select=""}={}) => {//filter={}--> عشان لو مدخلتش حاجه ميدينش ايرور
   const doc =  model.findById(filter);
    if(options.populate){
         doc.populate(options.populate);//  بتظهرلى معلومات البوست مثلا وكل ما يخص اليوزر دا join زى ال 
    }
    if(options.skip){
        doc.select(options.skip);//هنا بديله رقم فكانى بقوله عدى اول 2 يوزر وهات من بعدهم 
    }
    if(options.limit){
        doc.select(options.limit);// هنا بديله رقم فكانى بقوله هاتلى اول 10 يوزر 
    }
    if(select){
        doc.select(select);
    }

    return await doc.exec();//نفذلى الكلام دا كله بقى
 }  

 export const delete_many  = async ({model,filter={}}={}) => {
    return await model.deleteMany(filter);
 }