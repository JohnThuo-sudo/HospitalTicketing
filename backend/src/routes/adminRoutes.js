const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/auth");
const ensureRole = require("../middleware/role");

const router = express.Router();

// POST /api/admin/staff - Create a new staff account with no password initially
router.post(
  "/staff",
  verifyToken,
  ensureRole(["manager", "admin"]),
  authController.createStaffAccount,
);

module.exports = router;
