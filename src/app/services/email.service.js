/* eslint-disable no-console */
const nodemailer = require('nodemailer');
require('dotenv/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, token) => {
  const emailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Recuperar senha',
    html: `<body>
            <div>
                <div style='width: 50%; margin: 0 25% 0 25%; background-color: white; padding: 50px; border-radius: 30px;'>
                    <h3 style='font-size: 22px; font-weight: normal; color: rgb(63, 67, 69); text-align: center; margin: 30px 30% 0 30%; width: 40%;'> Clique no botão abaixo para redefinir sua senha </h3>
                    <div style="display: flex; justify-content: center; width: 100%; text-aling: center;">
                            <a href="${process.env.BASE_URL}/recoverPassword/${token}" style="display: flex; cursor: pointer; justify-content: center; margin-top: 50px; text-decoration: none; width: 100%; "> 
                                    <button style="width: 100%; padding: 20px; background-color: #32CD32; color: #FFFFFF; border: none; border-radius: 15px; font-size: 18px; cursor: pointer;"> 
                                            Redefinir senha 
                                    </button>
                            </a>
                    </div>
                </div>
                                
                <div style='text-align: center; margin: 30px 20% 0 20%; width: 60%;'> Caso você não tenha solicitado essa ação, por segurança troque sua senha e caso ocorra novamente entre em contato conosco. </div>
            </div>
        </body>`,
  };
  await transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to: ${email} Info :${info.response}`);
    }
  });
};

module.exports = {
  sendEmail,
};
