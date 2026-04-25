import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { Clock, User, Play } from "lucide-react";

const TicketDisplay = ({ data, variants, onStatusChange }) => {
  const { id, ticket_number, patient, sent_at, isOpened, status } = data;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Format sent_at time
  const formatSentAt = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = Math.max(0, now - date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get status color and text
  const getStatusInfo = () => {
    switch (status) {
      case "waiting":
        return { color: "bg-gray-500", text: "Waiting for Triage" };
      case "waiting-doctor":
        return { color: "bg-blue-500", text: "Waiting for Doctor" };
      case "waiting-pharmacy":
        return { color: "bg-purple-500", text: "Waiting for Pharmacy" };
      case "completed":
        return { color: "bg-emerald-600", text: "Completed" };
      case "rejected":
        return { color: "bg-red-500", text: "Rejected" };
      default:
        return { color: "bg-gray-500", text: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo();

  const canChangeStatus = () => {
    switch (user.role) {
      case "triage":
        return status === "waiting";
      case "doctor":
        return status === "waiting-doctor";
      case "pharmacist":
        return status === "waiting-pharmacy";
      default:
        return false;
    }
  };

  const getNextStatusText = () => {
    switch (user.role) {
      case "triage":
        return "Start Triage";
      case "doctor":
        return "Start Consultation";
      case "pharmacist":
        return "Process Pharmacy";
      default:
        return "";
    }
  };

  const handleStatusChange = () => {
    let newStatus;
    switch (user.role) {
      case "triage":
        newStatus = "waiting-doctor";
        break;
      case "doctor":
        newStatus = "waiting-pharmacy";
        break;
      case "pharmacist":
        newStatus = "completed";
        break;
      default:
        return;
    }
    onStatusChange(id, newStatus);
  };

  return (
    <Link to={`/staff/${user.role}/ticket/${id}`}>
      <motion.section
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={
          "rounded-md border border-gray-300 shadow-2xl shadow-black/35 cursor-pointer p-3 relative overflow-hidden " +
          (isOpened
            ? "bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400"
            : "bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700")
        }
        variants={variants}
      >
        {/* Status indicator */}
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusInfo.color}`}
        />

        {/* Status change button for staff */}
        {onStatusChange && canChangeStatus() && (
          <motion.button
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStatusChange();
            }}
            className="absolute top-2 left-2 bg-white/50 hover:bg-white rounded-full p-2 shadow-lg transition-colors backdrop-blur-[1px] hover:cursor-pointer"
            title={`Mark as ${getNextStatusText()}`}
          >
            <Play className="w-3 h-3 text-gray-600" />
          </motion.button>
        )}

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="w-full flex justify-between items-center font-semibold text-xl mb-2">
            <span className={isOpened ? "text-gray-800" : "text-white"}>
              Ticket #{ticket_number}
            </span>
            {!isOpened && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>

          {/* Patient Info */}
          <div className="flex-1 space-y-2">
            <div
              className={`flex gap-2 ${isOpened ? "text-gray-700" : "text-white"}`}
            >
              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="font-medium truncate">
                {patient?.full_name || "Unknown Patient"}
              </span>
            </div>

            {/* Status */}
            <div
              className={`text-xs px-2 py-1 rounded-full inline-block ${
                isOpened
                  ? "bg-white/70 text-gray-700"
                  : "bg-white/20 text-white"
              }`}
            >
              {statusInfo.text}
            </div>
          </div>

          {/* Footer with sent time */}
          <div
            className={`flex items-center gap-2 mt-3 pt-2 border-t ${
              isOpened ? "border-gray-300" : "border-white/30"
            }`}
          >
            <Clock
              className={`w-3 h-3 ${isOpened ? "text-gray-500" : "text-white/80"}`}
            />
            <span
              className={`text-xs ${isOpened ? "text-gray-500" : "text-white/80"}`}
            >
              {formatSentAt(sent_at)}
            </span>
          </div>
        </div>
      </motion.section>
    </Link>
  );
};

export default TicketDisplay;
