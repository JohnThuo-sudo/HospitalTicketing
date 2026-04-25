const supabase = require("../db/supabaseClient");

// Submit triage vitals
exports.submitVitals = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { temperature, bloodPressure, heartRate, description } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!temperature || !bloodPressure || !heartRate) {
      return res.status(400).json({ message: "All vital signs are required" });
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

    // Create triage record
    const { data: triageRecord, error: triageError } = await supabase
      .from("triage_record")
      .insert({
        ticket_id: ticketId,
        temperature,
        blood_pressure: bloodPressure,
        heart_rate: heartRate,
        description: description || "",
        created_by: userId,
      })
      .select()
      .single();

    if (triageError) {
      console.error("Triage record error:", triageError);
      return res.status(500).json({ message: "Failed to save triage record" });
    }

    // Update ticket status to waiting-doctor
    const { error: updateError } = await supabase
      .from("ticket")
      .update({ status: "waiting-doctor" })
      .eq("id", ticketId);

    if (updateError) {
      console.error("Ticket update error:", updateError);
    }

    res.status(201).json({
      message: "Vitals submitted successfully",
      triageRecord,
    });
  } catch (error) {
    console.error("Submit vitals error:", error);
    res.status(500).json({ message: "Server error submitting vitals" });
  }
};

// Get triage record for ticket
exports.getTriageRecord = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { data: triageRecord, error } = await supabase
      .from("triage_record")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return res.status(404).json({ message: "No triage record found" });
    }

    res.status(200).json(triageRecord);
  } catch (error) {
    console.error("Get triage record error:", error);
    res.status(500).json({ message: "Server error fetching triage record" });
  }
};
