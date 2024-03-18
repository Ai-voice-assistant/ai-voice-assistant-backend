import nodemailer from "nodemailer";
import { generateOTP } from "./generateOTP.js";

export const sendMail = async (to) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const otp = generateOTP();

  const subject = "OTP Verification";
  const text = `Your OTP for login AI voice assistant is ${otp}`;

  // Create an email message
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  return otp;
};
