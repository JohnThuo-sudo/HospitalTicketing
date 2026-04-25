const express = require("express");
const triageController = require("../controllers/triageController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/triage/:ticketId/vitals - Submit triage vitals (protected)
router.post("/:ticketId/vitals", verifyToken, triageController.submitVitals);

// GET /api/triage/:ticketId/record - Get triage record (protected)
router.get("/:ticketId/record", verifyToken, triageController.getTriageRecord);

module.exports = router;
