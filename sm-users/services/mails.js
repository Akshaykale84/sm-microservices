import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import otpSchema from '../models/otp.js';
import '../config/dbConfig.js';
import 'dotenv/config'

// Replace these values with your own email and SMTP server details
const emailConfig = {
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
};

// Create a transporter object using Nodemailer
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

const getOtp = () => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
}

const saveOtpToDb = (otp, email, type) => {
  return new Promise((resolve, reject) => {
    try {
      const data = new otpSchema({ email: email, otp: otp, type: type });
      const result = data.save();
      resolve(result);
    } catch (err) {
      console.log("error while storing the OTP in DB");
      reject(err)
    }
  })
}
// Function to send OTP via email
class Mails{
  static async sendOTP(recipientEmail){
    // Generate a 6-digit OTP
    const otp = getOtp()
  
    // Email message configuration
    const mailOptions = {
      from: `Support SM${emailConfig.user}`,
      to: recipientEmail,
      subject: 'Your One Time Password (OTP)',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>One Time Password (OTP)</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f8f8; margin: 0; padding: 0;">
  
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Your One Time Password (OTP)</h2>
                <p style="font-size: 16px;">Dear User,</p>
                <p style="font-size: 16px;">Your One Time Password (OTP) is:</p>
                <p style="font-size: 28px; font-weight: bold; color: #007bff;">${otp}</p>
                <p style="font-size: 16px;">This OTP is valid for a short duration. Do not share it with anyone.</p>
                <p style="font-size: 16px;">Thank you for using our service!</p>
            </div>
  
        </body>
        </html>
      `,
    };
  
    const sentOtp = saveOtpToDb(otp, recipientEmail, 'verify').then(async data => {
      try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return "success"; // Return the status for verification
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP via email.');
      }
    }).catch(e => {
      console.log(`second catch${e}`);
      return "error"
    })
    return sentOtp;
  }

  static async sendWelcomeMail(userName, email){
    const mailOptions = {
      from: `Team SocialSync`,
      to: email,
      subject: 'Welcome to SocialSync',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
          }
      
          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #333;
          }
      
          p {
            color: #666;
          }
      
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Our Community!</h1>
          <p>Dear ${userName},</p>
          <p>We are thrilled to welcome you to our community! Thank you for choosing to be a part of our journey.</p>
          <p>Here's what you can expect:</p>
          <ul>
            <li>Exciting events and updates</li>
            <li>Exclusive offers and promotions</li>
            <li>Valuable content and resources</li>
          </ul>
          <p>Feel free to explore our website and discover all the amazing things we have in store for you.</p>
          <p>Get started by clicking the button below:</p>
          <a class="button" href="[Your Website URL]">Explore Now</a>
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at ${emailConfig.user}.</p>
          <p>Once again, welcome aboard!</p>
          <p>Best regards,<br>Team SocialSync</p>
        </div>
      </body>
      </html>      
      `,
    };

    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return "success"; // Return the status for verification
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP via email.');
    }
  }
}

export default Mails;
