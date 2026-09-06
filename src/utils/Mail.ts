import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config({ path: '../.env' })

const transporter = nodemailer.createTransport({
    "service": 'gmail',
    auth: {
        "user": process.env.EMAIL_USER,
        "pass": process.env.EMAIL_PASS
    }
})


export const sendWelcomeEmail = async (to: string, subject: string, username: string) => {
    try {
        const emailOptions = {
            "from": `"${process.env.APPNAME}" <${process.env.EMAIL_USER}>`,
            "to": to,
            "subject": subject,
            "text": `Welcome ${username}! We wanna thank you for registering for Company`
        }
        const info = await transporter.sendMail(emailOptions);
        console.log("Email sent: " + info.response);

    } catch (e) {
        console.log("Error sending Welcome email: " + e.message)
    }
}

export const sendPasswordResetEmail = async (to: string, subject: string, resetLink: string) => {
    try {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                  <tr>
                    <td style="background-color:#166534;padding:24px;text-align:center;">
                      <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:-0.02em;">${process.env.APPNAME}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 24px 24px;">
                      <h1 style="margin:0 0 16px;font-size:22px;color:#111827;font-weight:600;">Reset your password</h1>
                      <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                        We received a request to reset your password. Click the button below to choose a new password.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                        <tr>
                          <td style="border-radius:8px;background-color:#166534;">
                            <a href="${resetLink}" style="display:inline-block;padding:12px 24px;font-size:15px;color:#ffffff;text-decoration:none;font-weight:600;">Reset Password</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Or copy and paste this link into your browser:</p>
                      <p style="margin:0;font-size:13px;color:#166534;word-break:break-all;">${resetLink}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.5;">
                        This link will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email.
                      </p>
                      <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} ${process.env.APPNAME}. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

        const emailOptions = {
            "from": `"${process.env.APPNAME}" <${process.env.EMAIL_USER}>`,
            "to": to,
            "subject": subject,
            "html": html,
            "text": `You requested a password reset. Click the link to reset your password: ${resetLink}`
        }
        const info = await transporter.sendMail(emailOptions);
        console.log("Password reset email sent: " + info.response);

    } catch (e) {
        console.log("Error sending password reset email: " + e.message)
    }
}
