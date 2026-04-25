const express = require("express");
const patientController = require("../controllers/patientController");
const triageController = require("../controllers/triageController");
const doctorController = require("../controllers/doctorController");
const pharmacyController = require("../controllers/pharmacyController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET /api/tickets - Get all tickets (protected)
router.get("/", verifyToken, patientController.getTickets);

// GET /api/tickets/:ticketId - Get ticket by ID (protected)
router.get("/:ticketId", verifyToken, patientController.getTicketById);

// POST /api/tickets/:ticketId/triage - Submit triage vitals (protected)
router.post("/:ticketId/triage", verifyToken, triageController.submitVitals);

// GET /api/tickets/:ticketId/triage - Get triage record (protected)
router.get("/:ticketId/triage", verifyToken, triageController.getTriageRecord);

// POST /api/tickets/:ticketId/doctor - Submit diagnosis (protected)
router.post("/:ticketId/doctor", verifyToken, doctorController.submitDiagnosis);

// GET /api/tickets/:ticketId/doctor - Get consultation (protected)
router.get("/:ticketId/doctor", verifyToken, doctorController.getConsultation);

// POST /api/tickets/:ticketId/pharmacy - Complete pharmacy (protected)
router.post(
  "/:ticketId/pharmacy",
  verifyToken,
  pharmacyController.completePharmacy,
);

// PATCH /api/tickets/:ticketId/status - Update ticket status directly (protected)
router.patch(
  "/:ticketId/status",
  verifyToken,
  patientController.updateTicketStatus,
);

// GET /api/tickets/:ticketId/pharmacy - Get pharmacy record (protected)
router.get(
  "/:ticketId/pharmacy",
  verifyToken,
  pharmacyController.getPharmacyRecord,
);

module.exports = router;
