import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import PasswordReset from "../models/PasswordReset.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, //465
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// sending email content the registered verification link
export const sendVerificationEmail = async (user, res) => {
  const { _id, email, firstName, lastName } = user;

  const token = _id + uuidv4();
  const link = APP_URL + "users/verify/" + _id + "/" + token;

  //   mail options
  const mailOptions = {
    from: `"Tamkeen" ${AUTH_EMAIL}`,
    to: email,
    replyTo: "noreply@tamkeen.com",
    subject: "Email Verification",
    html: `<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
              <td
                bgcolor="#ffffff"
                align="center"
                valign="top"
                style="
                  border-radius: 4px 4px 0px 0px;
                  color: #111111;
                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                  font-size: 48px;
                  font-weight: 400;
                  letter-spacing: 4px;
                  line-height: 48px;
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="125"
                  height="125"
                  fill="#1877f2"
                  class="bi bi-envelope-check-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207z"
                  />
                  <path
                    d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"
                  />
                </svg>
              </td>
            </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
					<h4>Hi ${lastName} ${firstName},</h4>
                        <p style="margin: 0;">Please verify your email address so we can know that it's really you.</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#1877f2"><a href=${link} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #1877f2; display: inline-block;">Verify Email Address</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 25px;">This link <b>expires in 1 hour</b></p></p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Best Regards,<br>Tamkeen Team</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`,
  };

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message:
              "Verification email has been sent to your account. Check your email for further instructions.",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Something went wrong" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// sending email content the reset password verification link
export const resetPasswordLink = async (user, res) => {
  const { _id, email } = user;

  const token = _id + uuidv4();
  const link = APP_URL + "users/reset-password/" + _id + "/" + token;

  //   mail options
  const mailOptions = {
    from: `"Tamkeen" ${AUTH_EMAIL}`,
    to: email,
    replyTo: "noreply@tamkeen.com",
    subject: "Password Reset",
    html: `<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
              <td
                bgcolor="#ffffff"
                align="center"
                valign="top"
                style="
                  border-radius: 4px 4px 0px 0px;
                  color: #111111;
                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                  font-size: 48px;
                  font-weight: 400;
                  letter-spacing: 4px;
                  line-height: 48px;
                "
              >
			  <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="#1877f2" class="bi bi-key-fill" viewBox="0 0 16 16">
  <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>
              </td>
            </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Password reset link. Please click the link below to reset password.</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#1877f2"><a href=${link} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #1877f2; display: inline-block;">Reset Password</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 25px;"><b>This link expires in 10 minutes</b></p></p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Best Regards,<br>Tamkeen Team</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`,
  };

  try {
    const hashedToken = await hashString(token);

    const resetEmail = await PasswordReset.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    if (resetEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message: "Reset Password Link has been sent to your account.",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Something went wrong" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
