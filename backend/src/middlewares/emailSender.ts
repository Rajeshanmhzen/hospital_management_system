import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const trasporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
});


async function emailSender(mailOptions:any) {
    const info = await trasporter.sendMail({
        from:mailOptions.from,
        to:mailOptions.to,
        subject:mailOptions.subject,
        text:mailOptions.text,
        html:mailOptions.html
    })
}

export default emailSender;