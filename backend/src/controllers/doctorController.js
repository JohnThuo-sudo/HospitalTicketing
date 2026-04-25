const supabase = require("../db/supabaseClient");

// Submit diagnosis
exports.submitDiagnosis = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { diagnosis, prescription, description } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!diagnosis || !prescription) {
      return res
        .status(400)
        .json({ message: "Diagnosis and prescription are required" });
    }

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from("ticket")
      .select("id, status")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Create consultation record
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .insert({
        ticket_id: ticketId,
        diagnosis,
        prescription,
        description: description || "",
        created_by: userId,
      })
      .select()
      .single();

    if (consultationError) {
      console.error("Consultation error:", consultationError);
      return res
        .status(500)
        .json({ message: "Failed to save consultation record" });
    }

    // Update ticket status to waiting-pharmacy
    const { error: updateError } = await supabase
      .from("ticket")
      .update({ status: "waiting-pharmacy" })
      .eq("id", ticketId);

    if (updateError) {
      console.error("Ticket update error:", updateError);
    }

    res.status(201).json({
      message: "Diagnosis submitted successfully",
      consultation,
    });
  } catch (error) {
    console.error("Submit diagnosis error:", error);
    res.status(500).json({ message: "Server error submitting diagnosis" });
  }
};

// Get consultation record for ticket
exports.getConsultation = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { data: consultation, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return res.status(404).json({ message: "No consultation record found" });
    }

    res.status(200).json(consultation);
  } catch (error) {
    console.error("Get consultation error:", error);
    res.status(500).json({ message: "Server error fetching consultation" });
  }
};
