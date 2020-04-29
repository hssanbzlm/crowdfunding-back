var nodemailer = require('nodemailer');


function sendEmail (emailHtml,email) 
{
    let transporter = nodemailer.createTransport({

        service: 'gmail',
    auth: {
       user: '**',
       pass: '**'
        }
    });
    let message = {
        from: '**',
        to: email,
        subject: 'Activation ✔',
        text:'welcome',
        html:emailHtml,        
    };
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            
        }
       
    });


} 

module.exports=sendEmail;
