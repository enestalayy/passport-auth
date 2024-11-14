require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: "15m", // Access token süresi
    refreshExpiration: "30d", // Refresh token süresi
    emailVerificationExpiration: "24h", // Email doğrulama token süresi
    passwordResetExpiration: "1h", // Şifre sıfırlama token süresi
  },

  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.EMAIL_FROM,
    templates: {
      verifyEmail: {
        subject: "Email Verification",
        // HTML template'leri ayrı dosyalarda tutulabilir
        template: "verify-email",
      },
      resetPassword: {
        subject: "Password Reset",
        template: "reset-password",
      },
      welcomeEmail: {
        subject: "Welcome to Our Platform",
        template: "welcome",
      },
    },
  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"],
  },

  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ["id", "emails", "name"],
    scope: ["email"],
  },

  security: {
    bcrypt: {
      saltRounds: 12,
    },
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 dakika
      max: 100, // her IP için limit
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },

  logging: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: process.env.NODE_ENV === "production" ? "combined" : "dev",
    files: {
      error: "logs/error.log",
      combined: "logs/combined.log",
      access: "logs/access.log",
    },
  },

  app: {
    url: process.env.APP_URL,
    name: process.env.APP_NAME || "Authentication Service",
    apiPrefix: "/api",
    routes: {
      auth: "/auth",
      users: "/users",
    },
  },

  audit: {
    enabled: true,
    events: {
      user: [
        "USER_REGISTERED",
        "USER_LOGGED_IN",
        "USER_LOGGED_OUT",
        "EMAIL_VERIFIED",
        "PASSWORD_CHANGED",
        "PASSWORD_RESET_REQUESTED",
        "PASSWORD_RESET_COMPLETED",
        "PROFILE_UPDATED",
        "ACCOUNT_DELETED",
      ],
      auth: [
        "TOKEN_REFRESHED",
        "TOKEN_REVOKED",
        "LOGIN_FAILED",
        "INVALID_TOKEN",
      ],
      admin: ["USER_BLOCKED", "USER_UNBLOCKED", "ROLE_CHANGED"],
    },
  },

  validation: {
    password: {
      minLength: 8,
      requireCapital: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
    username: {
      minLength: 3,
      maxLength: 30,
    },
  },
};

// Environment-specific overrides
if (config.env === "production") {
  config.security.cors.origin = process.env.ALLOWED_ORIGINS.split(",");
  config.logging.level = "info";
  config.session.cookie.secure = true;
} else if (config.env === "test") {
  config.mongodb.uri = process.env.TEST_MONGODB_URI;
  config.logging.level = "error";
}

// Validation
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "SESSION_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is missing`);
  }
});

module.exports = config;
