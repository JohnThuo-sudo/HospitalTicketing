import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const ManageStaff = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Replace with actual API call
        const mockStaff = [
          {
            id: 1,
            email: "john.doe@hospital.com",
            full_name: "John Doe",
            role: "doctor",
            is_active: true,
            created_at: "2024-01-15",
            last_login: "2024-12-20",
          },
          {
            id: 2,
            email: "jane.smith@hospital.com",
            full_name: "Jane Smith",
            role: "triage",
            is_active: true,
            created_at: "2024-02-10",
            last_login: "2024-12-19",
          },
          {
            id: 3,
            email: "mike.johnson@hospital.com",
            full_name: "Mike Johnson",
            role: "pharmacy",
            is_active: false,
            created_at: "2024-03-05",
            last_login: "2024-12-15",
          },
        ];
        setStaff(mockStaff);
      } catch (error) {
        showError("Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      // Replace with actual API call
      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, is_active: !currentStatus } : s,
        ),
      );
      showSuccess(
        `Staff ${currentStatus ? "deactivated" : "activated"} successfully`,
      );
    } catch (error) {
      showError("Failed to update staff status");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      // Replace with actual API call
      setStaff((prev) => prev.filter((s) => s.id !== staffId));
      showSuccess("Staff member deleted successfully");
    } catch (error) {
      showError("Failed to delete staff member");
    }
  };

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role) => {
    const roleNames = {
      triage: "Triage Nurse",
      doctor: "Doctor",
      pharmacy: "Pharmacist",
      manager: "Manager",
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => navigate("/hospital/admin")}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Staff</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctors</option>
                <option value="triage">Triage Nurses</option>
                <option value="pharmacy">Pharmacists</option>
                <option value="manager">Managers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getRoleDisplayName(member.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.last_login || "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(member.id, member.is_active)
                          }
                          className={`p-1 rounded ${
                            member.is_active
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={member.is_active ? "Deactivate" : "Activate"}
                        >
                          {member.is_active ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No staff members found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
