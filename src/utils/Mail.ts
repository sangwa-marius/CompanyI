import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    "service": 'gmail',
    auth:{
        "user":process.env.EMAIL_USER,
        "pass":process.env.EMAIL_PASSWORD
    }
})

const sendWelcomeEmail = async (to:string, subject:string)=>{
    try{
        const emailOptions ={
            "from":process.env.EMAIL_USER,
            "to":to,
            "subject":subject,
            "text":"Welcome to our app! We're glad to have you on board."
        }
        const info = await transporter.sendMail(emailOptions);
        console.log("Email sent: " + info.response);
        
    }catch(e){
        console.log("Error sending Welcome email: "+e.message)
    }
}