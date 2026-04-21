import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";


const TicketDisplay = ({ data, variants }) => {
  const { id, ticket_number, patient, sent_at, path, opened } = data;
  const isOpened = opened
  return (
    <Link to={path}>
    <motion.section
      whileHover={{
        scale: 1.04,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={
        "rounded-md border border-gray-300 shadow-2xl shadow-black/35 cursor-pointer p-3 " +
        (isOpened
          ? " bg-amber-300/80 hover:bg-amber-300"
          : " bg-green-500/95 hover:bg-green-500")
      }
      variants={variants}
    >

      <div className="flex flex-col">
        <div className="w-full flex justify-between items-center font-semibold text-xl">
          <span>Ticket</span>
          <span className="text-2xl">{ticket_number}</span>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex gap-2">
            <span className="font-semibold">Name: </span>
            <span>{patient}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Sent at:</span>
            <span>{new Date(sent_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.section>
    </Link>
  );
};

export default TicketDisplay;
