/*eslint-disable*/
const nodemailer = require('nodemailer');

const sendEmail = function(message, subject, userEmail){
        try{
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.PARENT_EMAIL,
                    pass: process.env.PARENT_PASSWORD
                }
            });
            transporter.sendMail({
                from: process.env.PARENT_EMAIL,
                to: `${userEmail}`,
                subject: `${subject}`,
                html: `${message}`
            });
           
    }catch(error){
        //const error = `Failed sending the email to ${userEmail}, Please try again ...`;
        console.log(error);
    }
}

module.exports = sendEmail;