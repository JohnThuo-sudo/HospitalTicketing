const supabase = require("../db/supabaseClient");

// Register patient and create ticket
exports.registerPatient = async (req, res) => {
  try {
    const { firstName, surName, lastName, phone, DOB, gender, paymentMethod } =
      req.body;

    // Validate input
    if (
      !firstName ||
      !surName ||
      !lastName ||
      !phone ||
      !DOB ||
      !gender ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fullName = `${firstName} ${surName} ${lastName}`;

    // Create patient record
    const { data: patient, error: patientError } = await supabase
      .from("patient")
      .insert({
        full_name: fullName,
        phone_number: phone,
        dob: DOB,
        gender,
        payment_method: paymentMethod.toLowerCase(),
        role: "patient",
      })
      .select()
      .single();

    if (patientError) {
      console.error("Patient creation error:", patientError);
      return res.status(500).json({ message: "Failed to register patient" });
    }

    // Get next ticket number
    const { data: lastTicket } = await supabase
      .from("ticket")
      .select("ticket_number")
      .order("ticket_number", { ascending: false })
      .limit(1)
      .single();

    const ticketNumber = (lastTicket?.ticket_number || 0) + 1;

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("ticket")
      .insert({
        ticket_number: ticketNumber,
        patient_id: patient.id,
        status: "waiting",
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Ticket creation error:", ticketError);
      return res.status(500).json({ message: "Failed to create ticket" });
    }

    res.status(201).json({
      message: "Patient registered successfully",
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        patient_id: patient.id,
        status: ticket.status,
      },
      patient: {
        id: patient.id,
        full_name: patient.full_name,
        phone: patient.phone_number,
      },
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Get all tickets
exports.getTickets = async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from("ticket")
      .select(
        `
        id,
        ticket_number,
        status,
        created_at,
        patient:patient_id (
          id,
          full_name,
          phone_number,
          dob,
          gender,
          payment_method
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch tickets error:", error);
      return res.status(500).json({ message: "Failed to fetch tickets" });
    }

    res.status(200).json({
      tickets,
      total: tickets.length,
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { data: ticket, error } = await supabase
      .from("ticket")
      .select(
        `
        id,
        ticket_number,
        status,
        created_at,
        updated_at,
        patient:patient_id (
          id,
          full_name,
          phone_number,
          dob,
          gender,
          payment_method
        ),
        triage_record (
          id,
          temperature,
          blood_pressure,
          heart_rate,
          description,
          created_at
        ),
        consultations (
          id,
          diagnosis,
          prescription,
          description,
          created_at
        ),
        pharmacy (
          id,
          verified,
          paid,
          cost,
          created_at
        )
      `,
      )
      .eq("id", ticketId)
      .single();

    if (error || !ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "waiting",
      "waiting-doctor",
      "waiting-pharmacy",
      "completed",
      "rejected",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid ticket status" });
    }

    const { data: ticket, error } = await supabase
      .from("ticket")
      .update({ status })
      .eq("id", ticketId)
      .select()
      .single();

    if (error || !ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket status updated", ticket });
  } catch (error) {
    console.error("Update ticket status error:", error);
    res.status(500).json({ message: "Server error updating ticket status" });
  }
};
