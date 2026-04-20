import React from 'react'
import Home from './pages/Home';
import { Routes, Route, useLocation, } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Register from './pages/Register';

function AppRouter() {
  const location = useLocation();
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      exit: {
        opacity: 0,
        y: -20
      }
    }
  }

  return (
    <AnimatePresence mode= "wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
          <motion.div
            vatiants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
            >
            <Home />
          </motion.div>}
        />
        <Route
        path="/register"
        element={
        <motion.div
          vatiants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
        >
          <Register />
        </motion.div>} />
      </Routes>      
    </AnimatePresence>

  );
}

export default AppRouter