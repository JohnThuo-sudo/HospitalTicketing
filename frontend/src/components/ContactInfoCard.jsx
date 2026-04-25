import { motion } from "framer-motion";
import React from "react";

const ContactInfoCard = ({patientFields}) => {
    
  const componentVariants = {
    initial: { opacity: 0, x: -200 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.35,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.main
      variants={componentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 "
    >
      <h2 className="font-semibold text-2xl mb-6 text-gray-700">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patientFields.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">{item.label}</label>

            <input
              type="text"
              value={item.value}
              disabled
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-700 outline-none"
            />
          </div>
        ))}
      </div>
    </motion.main>
  );
};

export default ContactInfoCard;
