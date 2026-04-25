const express = require("express");
const pharmacyController = require("../controllers/pharmacyController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/pharmacy/:ticketId/complete - Complete pharmacy (protected)
router.post(
  "/:ticketId/complete",
  verifyToken,
  pharmacyController.completePharmacy,
);

// POST /api/pharmacy/:ticketId/finish - Complete ticket (protected)
router.post(
  "/:ticketId/finish",
  verifyToken,
  pharmacyController.completeTicket,
);

// GET /api/pharmacy/:ticketId/record - Get pharmacy record (protected)
router.get(
  "/:ticketId/record",
  verifyToken,
  pharmacyController.getPharmacyRecord,
);

module.exports = router;
