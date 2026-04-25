const express = require("express");
const doctorController = require("../controllers/doctorController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/doctor/:ticketId/diagnosis - Submit diagnosis (protected)
router.post(
  "/:ticketId/diagnosis",
  verifyToken,
  doctorController.submitDiagnosis,
);

// GET /api/doctor/:ticketId/consultation - Get consultation (protected)
router.get(
  "/:ticketId/consultation",
  verifyToken,
  doctorController.getConsultation,
);

module.exports = router;
