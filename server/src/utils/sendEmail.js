import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, // from .env
    pass: process.env.MAILTRAP_PASS, // from .env
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "no-reply@bitexplore.com", // can be anything in Mailtrap
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
