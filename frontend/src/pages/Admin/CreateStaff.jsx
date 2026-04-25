import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStaffAccount } from "../../api/authApi";

const CreateStaff = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("triage");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const roles = [
    { label: "Triage", value: "triage" },
    { label: "Receptionist", value: "recepionist" },
    { label: "Doctor", value: "doctor" },
    { label: "Pharmacist", value: "pharmacist" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !role) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const data = await createStaffAccount({
        email,
        full_name: fullName,
        role,
      });

      setSuccess(
        "Staff account created successfully. The staff member can now complete registration.",
      );
      setEmail("");
      setFullName("");
      setRole("triage");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create staff account",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Create Staff Account</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new staff account so the employee can later complete
              registration.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
            onClick={() => navigate("/hospital/admin")}
          >
            Back to dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
            {success}
          </div>
        )}

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Full Name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Jane Doe"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="jane.doe@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
            >
              {roles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            Create Staff Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;
