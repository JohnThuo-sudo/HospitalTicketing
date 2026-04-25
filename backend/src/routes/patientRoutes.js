const express = require("express");
const patientController = require("../controllers/patientController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/patients/register - Register patient (public)
router.post("/register", patientController.registerPatient);

// GET /api/patients/tickets - Get all tickets (protected)
router.get("/tickets", verifyToken, patientController.getTickets);

// GET /api/patients/tickets/:ticketId - Get ticket by ID (protected)
router.get("/tickets/:ticketId", verifyToken, patientController.getTicketById);

module.exports = router;
