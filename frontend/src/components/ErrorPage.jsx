import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

const ErrorPage = ({
  title = "Oops! Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  showHomeButton = true,
  showRetryButton = false,
  onRetry = null,
}) => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const iconVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 200 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <motion.div
          variants={iconVariants}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle className="w-8 h-8 text-red-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          {showRetryButton && onRetry && (
            <motion.button
              onClick={onRetry}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          )}

          {showHomeButton && (
            <motion.button
              onClick={() => navigate("/")}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorPage;
