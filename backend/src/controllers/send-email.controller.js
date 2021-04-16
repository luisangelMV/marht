const nodemailer = require('nodemailer');

module.exports = sendEmail;

const { emailUser, emailServe, emailHost, emailPort, emailPassword } = process.env;

async function sendEmail({ to, subject, html, from = emailUser }) {
    const transporter = nodemailer.createTransport({ 
        service: emailServe, 
        host: emailHost, 
        port: emailPort, 
        auth: { 
            user: emailUser, 
            pass: emailPassword 
        },
    });
    await transporter.sendMail({ from, to, subject, html });
}