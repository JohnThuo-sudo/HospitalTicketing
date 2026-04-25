const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../db/supabaseClient");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const STAFF_ROLES = [
  "triage",
  "recepionist",
  "pharmacist",
  "doctor",
  "manager",
  "support",
];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
};

const buildUserResponse = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  role: user.role,
});

// Login staff/users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { data: user, error: fetchError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (fetchError) {
      console.error("Login fetch error:", fetchError);
      return res.status(500).json({ message: "Server error during login" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password_hash) {
      return res.status(403).json({
        message:
          "Account not yet registered. Please complete your staff registration.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.is_active || user.status !== "active") {
      return res
        .status(403)
        .json({ message: "Account is not active or suspended" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Update profile information
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res
        .status(400)
        .json({ message: "Full name and email are required" });
    }

    const { data: updatedUser, error } = await supabase
      .from("user")
      .update({ full_name, email: email.toLowerCase() })
      .eq("id", id)
      .select("id, email, full_name, role")
      .single();

    if (error || !updatedUser) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Change staff password
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    const { data: user, error: userError } = await supabase
      .from("user")
      .select("password_hash")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from("user")
      .update({ password_hash: hashedPassword })
      .eq("id", id);

    if (updateError) {
      console.error("Change password error:", updateError);
      return res.status(500).json({ message: "Failed to update password" });
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error changing password" });
  }
};  try {
    const { email, full_name, role } = req.body;

    if (!email || !full_name || !role) {
      return res
        .status(400)
        .json({ message: "Email, name, and role are required" });
    }

    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { data: existingUser, error: existingError } = await supabase
      .from("user")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingError) {
      console.error("Create staff check error:", existingError);
      return res
        .status(500)
        .json({ message: "Server error creating staff account" });
    }

    if (existingUser) {
      return res.status(409).json({ message: "Staff user already exists" });
    }

    const { data: newUser, error: createError } = await supabase
      .from("user")
      .insert({
        email: email.toLowerCase(),
        full_name,
        role,
        status: "pending",
        is_active: false,
        password_hash: null,
      })
      .select()
      .maybeSingle();

    if (createError) {
      console.error("Create staff error:", createError);
      return res
        .status(500)
        .json({ message: "Failed to create staff account" });
    }

    res.status(201).json({
      message: "Staff account created successfully",
      user: buildUserResponse(newUser),
    });
  } catch (error) {
    console.error("Create staff account error:", error);
    res.status(500).json({ message: "Server error creating staff account" });
  }
};

// Complete staff registration with password
exports.registerStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { data: existingUser, error: existingError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingError) {
      console.error("Register fetch error:", existingError);
      return res
        .status(500)
        .json({ message: "Server error during registration" });
    }

    if (!existingUser) {
      return res
        .status(404)
        .json({
          message: "Staff account not found. Ask admin to create it first.",
        });
    }

    if (existingUser.password_hash) {
      return res.status(409).json({ message: "Account is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: updatedUser, error: updateError } = await supabase
      .from("user")
      .update({
        password_hash: hashedPassword,
        status: "active",
        is_active: true,
      })
      .eq("id", existingUser.id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Register update error:", updateError);
      return res
        .status(500)
        .json({ message: "Failed to complete registration" });
    }

    const token = generateToken(updatedUser);

    res.status(201).json({
      token,
      user: buildUserResponse(updatedUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
