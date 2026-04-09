export const successResponse = ({res,statusCode=200,message= "Done",data=undefined}= {}) => 
    {
        console.log("success response executed");
        console.log(message);
    return res.status(statusCode).json({message,data});
    }
