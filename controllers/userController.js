const AuditService = require("../services/auditService");

class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = req.user;
      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const auditLogs = await AuditService.getUserAuditLogs(req.user.id, page);
      res.json(auditLogs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
