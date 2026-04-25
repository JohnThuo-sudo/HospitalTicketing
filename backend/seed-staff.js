const bcrypt = require("bcrypt");
const supabase = require("./src/db/supabaseClient");

async function seedStaffAccounts() {
  try {
    // Update manager account
    const managerPassword = await bcrypt.hash("Admin123!", 10);
    const { data: manager, error: managerError } = await supabase
      .from("user")
      .update({
        password_hash: managerPassword,
        status: "active",
        is_active: true,
      })
      .eq("email", "manager@hospital.com")
      .select()
      .single();

    if (managerError) {
      console.error("Error updating manager:", managerError);
    } else {
      console.log("Manager account updated:", manager.email);
    }

    // Update triage staff
    const triagePassword = await bcrypt.hash("Triage123!", 10);
    const { data: triage, error: triageError } = await supabase
      .from("user")
      .update({
        password_hash: triagePassword,
        status: "active",
        is_active: true,
      })
      .eq("email", "triage@hospital.com")
      .select()
      .single();

    if (triageError) {
      console.error("Error updating triage:", triageError);
    } else {
      console.log("Triage account updated:", triage.email);
    }

    // Update doctor
    const doctorPassword = await bcrypt.hash("Doctor123!", 10);
    const { data: doctor, error: doctorError } = await supabase
      .from("user")
      .update({
        password_hash: doctorPassword,
        status: "active",
        is_active: true,
      })
      .eq("email", "doctor@hospital.com")
      .select()
      .single();

    if (doctorError) {
      console.error("Error updating doctor:", doctorError);
    } else {
      console.log("Doctor account updated:", doctor.email);
    }

    // Update pharmacy staff
    const pharmacyPassword = await bcrypt.hash("Pharm123!", 10);
    const { data: pharmacy, error: pharmacyError } = await supabase
      .from("user")
      .update({
        password_hash: pharmacyPassword,
        status: "active",
        is_active: true,
      })
      .eq("email", "pharmacy@hospital.com")
      .select()
      .single();

    if (pharmacyError) {
      console.error("Error updating pharmacy:", pharmacyError);
    } else {
      console.log("Pharmacy account updated:", pharmacy.email);
    }

    console.log("\nStaff accounts updated successfully!");
    console.log("Login credentials:");
    console.log("Manager: manager@hospital.com / Admin123!");
    console.log("Triage: triage@hospital.com / Triage123!");
    console.log("Doctor: doctor@hospital.com / Doctor123!");
    console.log("Pharmacy: pharmacy@hospital.com / Pharm123!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seedStaffAccounts();
