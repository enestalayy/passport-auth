// /middleware/validation.js
const { body, validationResult } = require("express-validator");
const config = require("../config/config");

// Kullanıcı kaydı için validasyon
const validateRegistration = [
  body("name")
    .isLength({
      min: config.validation.username.minLength,
      max: config.validation.username.maxLength,
    })
    .withMessage(
      `Kullanıcı adı ${config.validation.username.minLength}-${config.validation.username.maxLength} karakter arasında olmalı.`
    ),

  body("email").isEmail().withMessage("Geçerli bir e-posta adresi girin."),

  body("password")
    .isLength({ min: config.validation.password.minLength })
    .withMessage(
      `Şifre en az ${config.validation.password.minLength} karakter olmalı.`
    )
    .matches(/[A-Z]/)
    .withMessage("Şifre en az bir büyük harf içermelidir.")
    .matches(/[0-9]/)
    .withMessage("Şifre en az bir rakam içermelidir.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Şifre en az bir özel karakter içermelidir."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Giriş için validasyon
const validateLogin = [
  body("email").isEmail().withMessage("Geçerli bir e-posta adresi girin."),
  body("password").notEmpty().withMessage("Şifre boş olamaz."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Şifre sıfırlama için validasyon
const validatePasswordReset = [
  body("password")
    .isLength({ min: config.validation.password.minLength })
    .withMessage(
      `Şifre en az ${config.validation.password.minLength} karakter olmalı.`
    )
    .matches(/[A-Z]/)
    .withMessage("Şifre en az bir büyük harf içermelidir.")
    .matches(/[0-9]/)
    .withMessage("Şifre en az bir rakam içermelidir.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Şifre en az bir özel karakter içermelidir."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
};
