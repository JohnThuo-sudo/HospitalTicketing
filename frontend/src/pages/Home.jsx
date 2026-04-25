import { Smile } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const [isSmiling, setIsSmiling] = useState(true);
  const container = {
    closed: {
      opacity: 0,
      y: 25,
      transition: {
        duration: 0.3,
        delay: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -25,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const item = {
    closed: {
      opacity: 0,
      y: 10,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <>
      <motion.div
        className="w-full h-screen flex items-center justify-center flex-col gap-4"
        variants={container}
        initial="closed"
        animate="open"
        exit="exit"
      >
        <motion.div variants={item}>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to the Hospital Ticketing System
          </h1>
        </motion.div>

        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            "w-[50%] h-[50%] transition-colors duration-300" +
            (isSmiling ? " text-yellow-500" : " text-blue-500")
          }
          variants={item}
          animate={{ rotate: isSmiling ? 2 : -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <circle cx="12" cy="12" r="10" />
          <path
            className={isSmiling ? "block" : "hidden"}
            d="M8 14s1.5 2 4 2 4-2 4-2"
          />
          <line
            className={isSmiling ? "hidden" : "block"}
            x1="8"
            x2="16"
            y1="14"
            y2="14"
          />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </motion.svg>

        <Link to="/register">
          <motion.button
            className={
              "px-6 py-3 rounded hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-2xl font-semibold" +
              (isSmiling
                ? " bg-yellow-500 text-shadow-gray-500"
                : " bg-blue-500 text-white")
            }
            onClick={() => setIsSmiling(!isSmiling)}
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get a Ticket
          </motion.button>
        </Link>
      </motion.div>
      <Link to="/staff">
        <div className="w-full flex justify-center mb-8 mt-8">
          <div className="w-[95%] bg-amber-300 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer rounded-lg shadow-2xl shadow-black/50 hover:bg-amber-300/90 transition-colors duration-300 hover:shadow-2xl hover:shadow-amber-800/70">
            Staff
          </div>
        </div>
      </Link>
    </>
  );
};

export default Home;
