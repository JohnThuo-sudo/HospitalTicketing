import React from "react";
import { motion } from "framer-motion";

const RegisterConfirm = ({ formData }) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut", staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h2 className="text-2xl font-bold mb-3" variants={itemVariants}>
        Confirm Your Details
      </motion.h2>
      <motion.p className="text-lg" variants={itemVariants}>
        Please review your details before submitting your registration. If
        everything looks correct, click the submit button to complete your
        registration for a ticket.
      </motion.p>
      <motion.div className="flex flex-col gap-2 mt-4" variants={itemVariants}>
        <motion.p variants={itemVariants}>
          <span className="font-semibold">Full Name:</span> {formData.fullName}
        </motion.p>
        <motion.p variants={itemVariants}>
          <span className="font-semibold">Date of Birth:</span> {formData.DOB}
        </motion.p>
        <motion.p variants={itemVariants}>
          <span className="font-semibold">Phone Number:</span> {formData.phone}
        </motion.p>
        <motion.p variants={itemVariants}>
          <span className="font-semibold">Gender:</span> {formData.gender}
        </motion.p>
        <motion.p variants={itemVariants}>
          <span className="font-semibold">Payment Method:</span>{" "}
          {formData.paymentMethod}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterConfirm;
