// app.js
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const winston = require("winston");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const config = require("./config/config");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Passport config
require("./config/passport");

// Winston logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Logging middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.mongodb.uri,
      touchAfter: 24 * 3600, // 24 saat
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    requestInfo: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" ? "An error occurred" : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    logger.info("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received");
  app.close(() => {
    logger.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = server;
