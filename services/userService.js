const User = require("../models/User");
const Token = require("../models/Token");
const TokenService = require("../utils/tokenService");
const EmailService = require("../utils/emailService");
const AuditService = require("./auditService");

class UserService {
  static async register(userData, reqInfo) {
    try {
      // Kullanıcıyı veritabanında oluştur
      const user = await User.create(userData);

      // Doğrulama token'ı oluştur ve kaydet
      const verificationToken = TokenService.generateEmailVerificationToken();
      await Token.create({
        userId: user._id,
        token: verificationToken,
        type: "emailVerification",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat
      });

      // Doğrulama e-postası gönder
      await EmailService.sendVerificationEmail(user, verificationToken);

      // Kayıt işlemini günlüğe kaydet
      await AuditService.log(user._id, "USER_REGISTERED", {}, reqInfo);

      return user;
    } catch (error) {
      // MongoDB'nin benzersizlik hatasını yakala
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new Error("Email already in use");
      }
      throw error; // Diğer hataları fırlat
    }
  }

  static async verifyEmail(token) {
    console.log("verifyEmail started... token: :>> ", token);
    const tokenDoc = await Token.findOne({
      token,
      type: "emailVerification",
    });
    console.log("token found... :>> ", tokenDoc);

    if (!tokenDoc) {
      throw new Error("Invalid or expired verification token");
    }

    const user = await User.findByIdAndUpdate(
      tokenDoc.userId,
      { emailVerified: true },
      { new: true }
    );
    console.log("user updated... :>> ", user);

    await Token.deleteOne({ _id: tokenDoc._id });
    await AuditService.log(user._id, "EMAIL_VERIFIED");

    return user;
  }

  static async initiatePasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = TokenService.generatePasswordResetToken();
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: "passwordReset",
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 saat
    });

    await EmailService.sendPasswordResetEmail(user, resetToken);
    await AuditService.log(user._id, "PASSWORD_RESET_REQUESTED");
  }

  static async resetPassword(token, newPassword) {
    const tokenDoc = await Token.findOne({
      token,
      type: "passwordReset",
    });

    if (!tokenDoc) {
      throw new Error("Invalid or expired reset token");
    }

    const user = await User.findById(tokenDoc.userId);
    user.password = newPassword;
    await user.save();

    await Token.deleteOne({ _id: tokenDoc._id });
    await AuditService.log(user._id, "PASSWORD_RESET_COMPLETED");

    return user;
  }
}

module.exports = UserService;
