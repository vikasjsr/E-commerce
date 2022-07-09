// const nodemailer = require("nodemailer");

// const sendEmail = async(options)=>{


//     const transporter = nodemailer.createTransport({
//         pool: true,
//         host: "smtp.example.com",
//         port: 465,
//         secure: true, // use TLS
//         service: process.env.SMTP_SERVICE,
//         auth:{
//             user: process.env.SMTP_MAIL,
//             pass: process.env.SMTP_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to:options.email,
//         subject: options.subject,
//         text: options.text,
//     }

  

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;