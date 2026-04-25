const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http")) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✓ Supabase client initialized");
  } catch (error) {
    console.error("Failed to initialize Supabase:", error.message);
    console.warn("⚠ Running in mock mode - some features may not work");
  }
} else {
  console.warn(
    "⚠ Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env",
  );
  console.warn("⚠ Running in mock mode - database operations will fail");

  // Create a mock supabase object that throws errors
  supabase = {
    from: () => {
      throw new Error("Supabase not configured");
    },
  };
}

module.exports = supabase;
