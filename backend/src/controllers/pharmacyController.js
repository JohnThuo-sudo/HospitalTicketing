const supabase = require("../db/supabaseClient");

// Complete pharmacy
exports.completePharmacy = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { verified, paid } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (typeof verified !== "boolean" || typeof paid !== "boolean") {
      return res
        .status(400)
        .json({ message: "Verified and paid status required" });
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

    const { cost } = req.body;

    // Create pharmacy record
    const { data: pharmacy, error: pharmacyError } = await supabase
      .from("pharmacy")
      .insert({
        ticket_id: ticketId,
        verified,
        paid,
        cost: cost || 0,
        created_by: userId,
      })
      .select()
      .single();

    if (pharmacyError) {
      console.error("Pharmacy error:", pharmacyError);
      return res
        .status(500)
        .json({ message: "Failed to save pharmacy record" });
    }

    // Update ticket status to completed (pharmacy processing done)
    const { error: updateError } = await supabase
      .from("ticket")
      .update({ status: "completed" })
      .eq("id", ticketId);

    if (updateError) {
      console.error("Ticket update error:", updateError);
    }

    res.status(201).json({
      message: "Pharmacy status updated successfully",
      pharmacy,
    });
  } catch (error) {
    console.error("Complete pharmacy error:", error);
    res.status(500).json({ message: "Server error updating pharmacy status" });
  }
};

// Complete ticket
exports.completeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from("ticket")
      .select("id, status")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update ticket status to completed
    const { data: updatedTicket, error: updateError } = await supabase
      .from("ticket")
      .update({ status: "completed" })
      .eq("id", ticketId)
      .select()
      .single();

    if (updateError) {
      console.error("Ticket update error:", updateError);
      return res.status(500).json({ message: "Failed to complete ticket" });
    }

    res.status(200).json({
      message: "Ticket completed successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Complete ticket error:", error);
    res.status(500).json({ message: "Server error completing ticket" });
  }
};

// Get pharmacy record for ticket
exports.getPharmacyRecord = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const { data: pharmacy, error } = await supabase
      .from("pharmacy")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return res.status(404).json({ message: "No pharmacy record found" });
    }

    res.status(200).json(pharmacy);
  } catch (error) {
    console.error("Get pharmacy record error:", error);
    res.status(500).json({ message: "Server error fetching pharmacy record" });
  }
};
