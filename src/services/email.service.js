var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

exports.sendEmail = (email, subject, html) => {
    var mailOptions = {
        from: process.env.email,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            //console.log(err);
        }
    });
}