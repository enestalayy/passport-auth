const passport = require("passport");

// Kullanıcının oturum açıp açmadığını kontrol eder
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Admin rolüne sahip kullanıcıların erişimini sağlar
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

// Passport authenticate middleware'i
const authenticate = passport.authenticate("jwt", { session: false });

module.exports = { ensureAuthenticated, ensureAdmin, authenticate };
