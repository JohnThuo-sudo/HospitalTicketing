import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { motion } from "framer-motion";

const RegisterPhoneDOB = ({ formData, setFormData, error, setError }) => {
  const [phone, setPhone] = useState(formData.phone || "");
  const [DOB, setDOB] = useState(formData.DOB || "");
  const [localError, setLocalError] = useState("");
  const phoneRef = useRef(null);
  const dobRef = useRef(null);

  // Sync local state with formData when it changes
  useEffect(() => {
    setPhone(formData.phone || "");
    setDOB(formData.DOB || "");
  }, [formData.phone, formData.DOB]);

  const focus = (element) => {
    if (element.current) {
      const target =
        element.current.querySelector?.("input") || element.current;
      target?.focus?.();
    }
  };

  const handleError = (err) => {
    setLocalError(err);
    console.log(err);
    if (err.toLowerCase().includes("phone")) {
      focus(phoneRef);
    } else if (err.toLowerCase().includes("birth")) {
      focus(dobRef);
    }
    setTimeout(() => {
      setLocalError("");
    }, 2000);
  };

  const handlePhoneChange = (e) => {
    const target = e.target;
    const formattedValue = target.value.replace(/\D/g, "").slice(0, 10); // Remove non-digit characters and limit to 10 digits
    target.value = formattedValue;
    setPhone(target.value);
    setLocalError(""); // Clear error when valid input is entered
    setFormData((prevData) => ({
      ...prevData,
      phone: target.value,
    }));
  };

  const handleDOBChange = (e) => {
    const target = e.target;
    setDOB(target.value);
    setLocalError(""); // Clear error when valid input is entered
    setFormData((prevData) => ({
      ...prevData,
      DOB: target.value,
    }));
  };

  const componentVariants = {
    initial: {
      opacity: 0,
      x: -200,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
    },
  };

  const item = {
    initial: {
      opacity: 0,
      x: 20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-5 w-[70%] mx-auto"
      variants={componentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h2 className="text-2xl font-bold mb-3">Fill Contact Details</h2>
      {error || localError ? (
        <span className="text-red-500">{error || localError}</span>
      ) : null}
      <Input
        label="Phone Number"
        placeholder="0700000000"
        value={phone}
        onChange={handlePhoneChange}
        Required
        ref={phoneRef}
        variants={item}
      />

      <Input
        label="Date of Birth"
        type="date"
        value={DOB}
        onChange={handleDOBChange}
        required
        ref={dobRef}
        variants={item}
      />
    </motion.div>
  );
};

export default RegisterPhoneDOB;
