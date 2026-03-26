
export const authorization= (roles=[])=>{// وفى نفس الوقت اديها متغير middleware  عملت كدا عشان عيواها تبقى 
    return async(req,res,next)=>{
        if(!roles.includes(req.user.role)){//if roles not include user then not authorization
            //req.user :authentication لانى قولت انى ببقى اصلا 
            throw new Error("unAuthorization"); 
        }
        next()
    }
}