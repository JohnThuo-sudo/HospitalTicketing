import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TicketDisplay from "./TicketDisplay";
import { RefreshCw, AlertCircle, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "../api/ticketApi";
import { useNotification } from "../context/NotificationContext";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = () => {
  const [isSelectOn, setIsSelectOn] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const filterRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showError } = useNotification();
  const navigate = useNavigate();

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // Replace with actual API call to update ticket status
      console.log(`Changing ticket ${ticketId} to status ${newStatus}`);
      // For now, just refresh the tickets
      await fetchTickets(true);
    } catch (error) {
      showError("Failed to update ticket status");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsSelectOn(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTickets = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getTickets();

        setTickets(data.tickets || []);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch tickets";
        showError(errorMessage);
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filters = [
    { id: 1, value: "today", name: "Today's Tickets" },
    { id: 2, value: "thisweek", name: "This Week" },
    { id: 3, value: "twoweeks", name: "Two Weeks" },
    { id: 4, value: "thismonth", name: "This Month" },
    { id: 5, value: "threemonths", name: "Three Months" },
  ];

  const handleFilter = (filterValue) => {
    setActiveFilter(filterValue);
    setIsSelectOn(false);
  };

  const now = Date.now();
  
  // Enhanced filtering with sent_at logic
  const filteredTickets = tickets

    .map((ticket) => {
      // Calculate sent_at based on ticket status and user role
      let sentAt = new Date(ticket.created_at);
      let isOpened = false;

      // Determine when this ticket was "sent" to the current user based on status
      switch (user.role) {
        case "triage":
          if (ticket.status === "waiting") {
            sentAt = new Date(ticket.created_at);
          } else if (
            ["waiting-doctor", "waiting-pharmacy", "completed"].includes(
              ticket.status,
            )
          ) {
            sentAt = new Date(ticket.updated_at);
            isOpened = true;
          }
          break;
        case "doctor":
          if (ticket.status === "waiting-doctor") {
            sentAt = new Date(ticket.updated_at);
          } else if (
            ["waiting-pharmacy", "completed"].includes(ticket.status)
          ) {
            sentAt = new Date(ticket.updated_at);
            isOpened = true;
          }
          break;
        case "pharmacist":
          if (ticket.status === "waiting-pharmacy") {
            sentAt = new Date(ticket.updated_at);
          } else if (["completed"].includes(ticket.status)) {
            sentAt = new Date(ticket.updated_at);
            isOpened = true;
          }
          break;
        default:
          sentAt = new Date(ticket.created_at);
      }

      return {
        ...ticket,
        sent_at: sentAt,
        isOpened,
      };
    })
    .filter((ticket) => {
      const sentAtTime = new Date(ticket.created_at).getTime();
      const diff = now - sentAtTime;

      switch (activeFilter) {
        case "today":
          return diff <= 86400000; // 24 hours
        case "thisweek":
          return diff <= 7 * 86400000; // 7 days
        case "twoweeks":
          return diff <= 14 * 86400000; // 14 days
        case "thismonth":
          return diff <= 30 * 86400000; // 30 days
        case "threemonths":
          return diff <= 90 * 86400000; // 90 days
        default:
          return true;
      }
    })
    .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at)); // Most recent first

  const currentFilterName = filters.find((f) => f.value === activeFilter)?.name;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const ticketVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col p-8 gap-4 h-screen bg-gray-100/15 items-center justify-center">
        <LoadingSpinner size="lg" message="Loading tickets..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 gap-4 h-screen bg-gray-100/15">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">
          Welcome <span className="text-blue-900">{user.full_name}</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            title="View Profile"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={() => fetchTickets(true)}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
            title="Refresh tickets"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <main className="m-2 ml-6">
        <div className="relative w-[35%] md:w-[20%]">
          <div
            ref={filterRef}
            onClick={() => {
              setIsSelectOn((prev) => !prev);
            }}
            className="flex justify-between items-center bg-gray-500/50 px-3 py-2 font-semibold rounded-2xl cursor-pointer z-20 relative"
          >
            <span>{currentFilterName}</span>

            <motion.div
              animate={{ rotate: isSelectOn ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown />
            </motion.div>
          </div>

          <AnimatePresence>
            {isSelectOn && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-xl overflow-hidden z-50"
              >
                {filters.map((filter) => (
                  <div
                    key={filter.id}
                    onClick={() => handleFilter(filter.value)}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {filter.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-600">
                {activeFilter === "today"
                  ? "No tickets for today. Check back later or adjust your filter."
                  : `No tickets found for ${currentFilterName.toLowerCase()}.`}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 mt-7 gap-5"
          >
            {filteredTickets.map((ticket) => (
              <TicketDisplay
                key={ticket.id}
                data={ticket}
                variants={ticketVariants}
                onStatusChange={handleStatusChange}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
