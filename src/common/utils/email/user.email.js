export const sendEmail =async()=>{
    const transporter = createTransport({
        service:"gmail",
        auth :{
            user : EMAIL,
            pass :PASSWORD
        }
    }) 

    const info = await transporter.sendEmail({
        from:EMAIL,
        to,
        subject,
        html,
        attachments
    })

    console.log("message sent :".info.messageId)
    return info.accepted.length ? true : false
}
export const generateOTP=async ()=>{
    return Math.floor(100000 + Math.random() * 900000)
}