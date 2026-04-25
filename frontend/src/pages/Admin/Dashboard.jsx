import {
  Contact,
  Users,
  UserCheck,
  UserX,
  Activity,
  Settings,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const links = [
    {
      id: 1,
      name: "Create Staff Account",
      to: "/hospital/admin/create-staff",
      icon: Contact,
    },
    {
      id: 2,
      name: "Manage Staff",
      to: "/hospital/admin/manage-staff",
      icon: Users,
    },
    {
      id: 3,
      name: "Staff Activities",
      to: "/hospital/admin/staff-activities",
      icon: Activity,
    },
    {
      id: 4,
      name: "Profile Settings",
      to: "/profile",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Use the links below to manage staff accounts and monitor hospital
          operations.
        </p>

        <section className="grid gap-4 sm:grid-cols-2">
          {links.map(({ id, name, to, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(to)}
              className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-100 px-6 py-5 text-left text-lg font-semibold text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-200 transition"
            >
              <Icon className="h-6 w-6 text-blue-600" />
              {name}
            </button>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold mb-3">
            Staff Management Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Create staff accounts, manage existing staff members, monitor their
            activities, and oversee hospital operations. Use the options above
            to access different management features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border">
              <UserCheck className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Active Staff</h3>
              <p className="text-gray-600">Manage current staff members</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <UserX className="w-8 h-8 text-red-600 mb-2" />
              <h3 className="font-semibold">Staff Control</h3>
              <p className="text-gray-600">Enable/disable staff accounts</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <Activity className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Activity Monitoring</h3>
              <p className="text-gray-600">
                Track staff activities and performance
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
