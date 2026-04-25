import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut, ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
    navigate("/staff");
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      triage: "Triage Nurse",
      receptionist: "Receptionist",
      pharmacist: "Pharmacist",
      doctor: "Doctor",
      manager: "Manager",
      support: "Support Staff",
    };
    return roleNames[role] || role;
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.1 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-8 mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.full_name}
              </h2>
              <p className="text-gray-600">{getRoleDisplayName(user.role)}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{getRoleDisplayName(user.role)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Settings
          </h3>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              <User className="w-5 h-5" />
              Change Password
            </button>

            <button className="w-full flex items-center justify-center gap-3 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200">
              <Shield className="w-5 h-5" />
              Update Profile Information
            </button>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h3>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
