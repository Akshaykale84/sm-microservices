import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
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

const getOtp = () =>{
    return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false,  specialChars: false });
}

// Function to send OTP via email
const sendOTP = async (recipientEmail) => {
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

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return otp; // Return the OTP for verification
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP via email.');
  }
}

// Example usage
// sendOTP(recipientEmail)
//   .then((otp) => {
//     console.log(`OTP sent to ${recipientEmail}: ${otp}`);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });

export default sendOTP;
