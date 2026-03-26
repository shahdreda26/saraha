export const successResponse = ({res,statusCode=200,message= "Done",data=undefined}= {}) => 
    {
    return res.status(statusCode).json({message,data});
    }
