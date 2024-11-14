const User = require("../models/User");
const Token = require("../models/Token");
const TokenService = require("../utils/tokenService");
const AuditService = require("./auditService");

class AuthService {
  static async login(user, reqInfo) {
    const accessToken = TokenService.generateAccessToken(user);
    const refreshToken = TokenService.generateRefreshToken(user);

    await Token.create({
      userId: user._id,
      token: refreshToken,
      type: "refresh",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
    });

    await AuditService.log(user._id, "USER_LOGGED_IN", {}, reqInfo);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async refreshToken(refreshToken) {
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      type: "refresh",
    });

    if (!tokenDoc) {
      throw new Error("Invalid refresh token");
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = TokenService.generateAccessToken(user);
    const newRefreshToken = TokenService.generateRefreshToken(user);

    // Eski refresh token'ı sil ve yenisini oluştur
    await Token.deleteOne({ _id: tokenDoc._id });
    await Token.create({
      userId: user._id,
      token: newRefreshToken,
      type: "refresh",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await AuditService.log(user._id, "TOKEN_REFRESHED");

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId, refreshToken) {
    await Token.deleteOne({
      userId,
      token: refreshToken,
      type: "refresh",
    });

    await AuditService.log(userId, "USER_LOGGED_OUT");
  }
}

module.exports = AuthService;
