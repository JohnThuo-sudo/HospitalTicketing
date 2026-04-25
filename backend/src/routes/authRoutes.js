const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register
// Completes registration for staff accounts created by admin
router.post("/register", authController.registerStaff);

// PATCH /api/auth/profile - update profile information
router.patch("/profile", verifyToken, authController.updateProfile);

// PATCH /api/auth/password - change password
router.patch("/password", verifyToken, authController.changePassword);

module.exports = router;
