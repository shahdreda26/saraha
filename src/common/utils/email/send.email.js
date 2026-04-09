import nodemailer from "nodemailer";
import { email, password } from "../../config/email.config.js";

export const sendEmail = async ({to,subject,html,attachments}) => {

const transporter = nodemailer.createTransport({
 
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false, //if true the port should be 465 & false for 587
  service: "gmail", // بدل من ال 3 حاجات   
  auth: {
    user: email,
    pass: password,// مينفعش يبقى الباسورد الحقيقى هجيب app password --> manage your google account --> 2step vrefication security --> app passwords --> generate --> name app
  },
});
  const info = await transporter.sendMail({
    from: `"shosho : " <${email}>`,
    to: to,
    subject: subject ||"Hello Dear, This is a test email from nodemailer", 
    html:html|| "<b>Hello world</b>", 
    attachments: attachments || [] // [{ filename: 'file.txt', path: resolve('./file.txt') }] // absolute path to file 
  });

  console.log("Message sent:", info.messageId);

  return info.accepted.length > 0 ? "Email sent successfully" : "Failed to send email";

}