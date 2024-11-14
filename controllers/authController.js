const AuthService = require("../services/authService");
const UserService = require("../services/userService");

class AuthController {
  static async register(req, res, next) {
    try {
      const reqInfo = {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };

      const user = await UserService.register(req.body, reqInfo);
      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const reqInfo = {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };

      const authData = await AuthService.login(req.user, reqInfo);
      res.json(authData);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(req.user.id, refreshToken);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;
      await UserService.verifyEmail(token);
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await UserService.initiatePasswordReset(email);
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await UserService.resetPassword(token, password);
      res.json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
