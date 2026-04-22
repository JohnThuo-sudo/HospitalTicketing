import React, { useEffect, useRef, useState } from "react";
import TicketDisplay from "./TicketDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [isSelectOn, setIsSelectOn] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const filterRef = useRef(null);

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

  const location = useLocation().pathname;
  console.log(location)

  const tickets = [
    {
      id: 100,
      ticket_number: 1,
      patient: "John Doe",
      sent_at: Date.now(),
      path: `${location}/ticket/:id`,
      opened: false,
    },
    {
      id: 101,
      ticket_number: 2,
      patient: "John Doe",
      sent_at: Date.now() - 86400000, // yesterday
      path: `${location}/ticket/:id`,
      opened: true,
    },
    {
      id: 102,
      ticket_number: 3,
      patient: "John Doe",
      sent_at: Date.now() - 7 * 86400000,
      path: "/ticket?1",
      opened: true,
    },
    {
      id: 103,
      ticket_number: 4,
      patient: "John Doe",
      sent_at: Date.now() - 30 * 86400000,
      path: "/ticket?1",
      opened: true,
    },
    {
      id: 104,
      ticket_number: 5,
      patient: "John Doe",
      sent_at: Date.now() - 30 * 86400000,
      path: "/ticket?1",
      opened: true,
    },

  ];

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

  const filteredTickets = tickets.filter((ticket) => {
    const diff = now - ticket.sent_at;

    switch (activeFilter) {
      case "today":
        return diff <= 86400000;
      case "thisweek":
        return diff <= 7 * 86400000;
      case "twoweeks":
        return diff <= 14 * 86400000;
      case "thismonth":
        return diff <= 30 * 86400000;
      case "threemonths":
        return diff <= 90 * 86400000;
      default:
        return true;
    }
  });

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
        // ease: "easeOut",
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="flex flex-col p-8 gap-4 h-screen bg-gray-100/15">
      <h1 className="font-bold text-3xl">
        Welcome <span className="text-blue-900">DR. John Doe</span>
      </h1>

      <main className="m-2 ml-6">
        <div className="relative w-[35%] md:w-[20%]">
          <div
            ref={filterRef}
            onClick={(e) => {
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
            />
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
