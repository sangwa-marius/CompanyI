import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    "service": 'gmail',
    auth:{
        "user":process.env.EMAIL_USER,
        "pass":process.env.EMAIL_PASS
    }
})

export const sendWelcomeEmail = async (to:string, subject:string, username:string)=>{
    try{
        const emailOptions ={
            "from":`<${process.env.APPNAME}>`,
            "to":to,
            "subject":subject,
            "text":`Welcome ${username}! We wanna thank you for registering for Company`
        }
        const info = await transporter.sendMail(emailOptions);
        console.log("Email sent: " + info.response);
        
    }catch(e){
        console.log("Error sending Welcome email: "+e.message)
    }
}

