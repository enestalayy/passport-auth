const AuditLog = require("../models/AuditLog");

class AuditService {
  static async log(userId, action, details = {}, reqInfo = {}) {
    await AuditLog.create({
      userId,
      action,
      details,
      ip: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });
  }

  static async getUserAuditLogs(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments({ userId });

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = AuditService;
