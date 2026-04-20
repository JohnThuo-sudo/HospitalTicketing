import React from "react";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import Register from "./pages/Register";
import StaffLogin from "./pages/StaffLogin";

function AppRouter() {
  const location = useLocation();
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.8,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/staff"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <StaffLogin />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRouter;
