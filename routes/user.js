const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

router.get("/profile", authenticate, UserController.getProfile);
router.get("/audit-logs", authenticate, UserController.getAuditLogs);

module.exports = router;
