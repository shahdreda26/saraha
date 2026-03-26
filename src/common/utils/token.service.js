
import jwt from "jsonwebtoken"

//payload:الداتا الى من خلالها بمسك اليوزر واقدر اتعامل معاه & secret key --> create token
      export  const generate_token=({payload,secret_key,options={}} = {})=>{
            return  jwt.sign(payload,secret_key,options)
      } 
        // "iat": 1774108468 -->الوقت الى اتكريت فيه التوكين بالمللى ثانيه --> issued at time

      export  const verify_token=({token,secret_key,options={}} = {})=>{//بفك التوكين 
            return  jwt.verify(token,secret_key,options)
      } 