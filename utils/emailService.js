const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport(config.email.smtp);
const welcomeEmailTemplate = require("../config/email-templates/welcome");
const verifyEmailTemplate = require("../config/email-templates/verify-email");
const resetPasswordTemplate = require("../config/email-templates/reset-password");

class EmailService {
  static async sendWelcomeEmail(user) {
    const htmlContent = welcomeEmailTemplate(user);
    await transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: config.email.templates.welcomeEmail.subject,
      html: htmlContent,
    });
  }
  static async sendVerificationEmail(user, token) {
    const verificationUrl = `${config.app.url}/verify-email?token=${token}`;

    const htmlContent = verifyEmailTemplate(user, verificationUrl);
    await transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: config.email.templates.verifyEmail.subject,
      html: htmlContent,
    });
  }

  static async sendPasswordResetEmail(user, token) {
    const resetUrl = `${config.appUrl}/reset-password?token=${token}`;

    const htmlContent = resetPasswordTemplate(user, resetUrl);
    await transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: config.email.templates.resetPassword.subject,
      html: htmlContent,
    });
  }
}

module.exports = EmailService;
