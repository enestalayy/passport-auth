const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/config");

class TokenService {
  static generateAccessToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiration }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign({ userId: user._id }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiration,
    });
  }

  static generateEmailVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generatePasswordResetToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret);
  }
}

module.exports = TokenService;
