const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthController = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
} = require("../middleware/validation");
const { authenticate } = require("../middleware/auth");

router.post("/register", validateRegistration, AuthController.register);
router.post(
  "/login",
  validateLogin,
  passport.authenticate("local"),
  AuthController.login
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", authenticate, AuthController.logout);
router.get("/verify-email", AuthController.verifyEmail);
router.post("/forgot-password", AuthController.forgotPassword);
router.post(
  "/reset-password",
  validatePasswordReset,
  AuthController.resetPassword
);

// OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google"),
  AuthController.login
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  AuthController.login
);

module.exports = router;
