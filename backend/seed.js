const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Admin user with manager role
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const adminEmail = "admin@hospital.com";

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from("user")
      .select("id")
      .eq("email", adminEmail)
      .maybeSingle();

    if (existingAdmin) {
      console.log("✓ Admin user already exists, skipping...");
    } else {
      const { data: admin, error: adminError } = await supabase
        .from("user")
        .insert({
          full_name: "System Administrator",
          email: adminEmail,
          phone: "+254700000001",
          password_hash: adminPassword,
          role: "manager",
          status: "active",
          is_active: true,
        })
        .select()
        .maybeSingle();

      if (adminError) {
        console.error("❌ Error creating admin user:", adminError.message);
      } else {
        console.log("✓ Admin user created");
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: Admin@123`);
        console.log(`  Role: manager`);
      }
    }

    // Sample staff accounts (no password initially - they'll set on first login)
    const staffMembers = [
      {
        full_name: "Dr. Jane Smith",
        email: "jane.smith@hospital.com",
        phone: "+254700000002",
        role: "doctor",
      },
      {
        full_name: "Mr. John Omondi",
        email: "john.omondi@hospital.com",
        phone: "+254700000003",
        role: "triage",
      },
      {
        full_name: "Ms. Sarah Kipchoge",
        email: "sarah.kipchoge@hospital.com",
        phone: "+254700000004",
        role: "pharmacist",
      },
      {
        full_name: "Ms. Alice Mwangi",
        email: "alice.mwangi@hospital.com",
        phone: "+254700000005",
        role: "recepionist",
      },
      {
        full_name: "Mr. Peter Nakuru",
        email: "peter.nakuru@hospital.com",
        phone: "+254700000006",
        role: "doctor",
      },
      {
        full_name: "Ms. Grace Kipchoge",
        email: "grace.kipchoge@hospital.com",
        phone: "+254700000007",
        role: "pharmacist",
      },
    ];

    console.log("\n📝 Creating sample staff accounts...\n");

    for (const staff of staffMembers) {
      // Check if staff already exists
      const { data: existingStaff } = await supabase
        .from("user")
        .select("id")
        .eq("email", staff.email)
        .maybeSingle();

      if (existingStaff) {
        console.log(`✓ ${staff.full_name} already exists, skipping...`);
        continue;
      }

      const { data: createdStaff, error: staffError } = await supabase
        .from("user")
        .insert({
          full_name: staff.full_name,
          email: staff.email,
          phone: staff.phone,
          password_hash: null, // Will be set when they register
          role: staff.role,
          status: "pending",
          is_active: false,
        })
        .select()
        .maybeSingle();

      if (staffError) {
        console.error(
          `❌ Error creating ${staff.full_name}:`,
          staffError.message,
        );
      } else {
        console.log(`✓ ${staff.full_name} (${staff.role})`);
        console.log(`  Email: ${staff.email}`);
      }
    }

    console.log("\n✅ Database seeding completed successfully!\n");
    console.log("📋 Login credentials:");
    console.log("   Email: admin@hospital.com");
    console.log("   Password: Admin@123");
    console.log(
      "\n💡 Tip: Admin can now login and create more staff accounts via the admin panel.",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    process.exit(1);
  }
};

seedData();
