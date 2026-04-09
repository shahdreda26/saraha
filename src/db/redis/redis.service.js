export const revoke_prefix =(userId,tokenId)=>{//دا ما هى الا عشان مغلطش وانا بكتب الكى من مكان للتانى
    return `revoke_token::${userId}::${tokenId}` // revoke_token::485632586586=userId ::21485254865324=tokenId
}

export const get_token =(userId)=>{
    return `revoke_token::${userId}` // revoke_token::485632586586=userId 
}

export const setValue = async ({key, value,ttl}) => {

    try{
        const data = typeof value === "string" ? value : JSON.stringify(value);//if value is string return it else convert it to string by json.stringify
        return ttl? await redis_client.set(key, data,{EX:ttl}) : await redis_client.set(key, data);// if ttl exist set key with ttl else set key without ttl
    }catch(error){
        console.log(error,"fail to set value in redis");
    }}   

export const updateValue = async (key) => {

    try{
        if(!await redis_client.exists(key)) return 0 // if key not exist return 0
        return await setValue({key, value,ttl})     
    }catch(error){
        console.log(error,"fail to update operation in redis");
    }} 

// {key:"key"} انا بدخل الداتا كدا --> {"key":"key"}اما هعملها stringify
// "value as string" 
export const getValue = async (key) => {

    try{ 
        try{
            return JSON.parse(await redis_client.get(key)) // if value is object
        }
        catch(error){
            return await redis_client.get(key) // if value is string
        }
    }catch(error){
        console.log(error,"fail to get value from redis");
    }}

export const ttl = async (key) => {

    try{ 
        return await redis_client.ttl(key) // == ttl name --> return 15
        }
    catch(error){
        console.log(error,"fail to get ttl from redis");
     }  }
    
export const exists = async (key) => {

    try{ 
        return await redis_client.exists(key) // == exists name --> return 1 if key exists and 0 if key not exist
        }
    catch(error){
        console.log(error,"fail to get exists from redis");
     }  }
    
export const expire = async ({key, ttl}) => {

    try{ 
        return await redis_client.expire(key, ttl) // == expire name 20--> return 1 if key expired and 0 if key not exist
        }
    catch(error){
        console.log(error,"fail to get expire from redis");
     }  }
    
export const deleteKey = async (key) => {

    try{      
        if(!key.length) return 0 // if key is undefined or empty يعنى مش هبعت حاجه تتمسح return 0    
        return await redis_client.del(key) // == del name --> return 1 if key deleted and 0 if key not exist
      }
    catch(error){
        console.log(error,"fail to delete key from redis");
     }  }

export const keys = async (pattern) => {  

    try{
        return await redis_client.keys(`${pattern}*`) // == keys user* --> return array فيها كل ال keys الى هتبدا ب user
    }catch(error){
        console.log(error,"fail to get keys from redis");
    }
}
