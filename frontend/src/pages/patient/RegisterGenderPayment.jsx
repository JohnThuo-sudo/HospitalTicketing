import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const RegisterGenderPayment = ({ formData, setFormData, error, setError }) => {
  const [gender, setGender] = useState(formData.gender || "");
  const [paymentMethod, setPaymentMethod] = useState(
    formData.paymentMethod || "",
  );
  const [localError, setLocalError] = useState("");
  const genderRef = useRef(null);
  const paymentRef = useRef(null);

  // Sync local state with formData when it changes
  useEffect(() => {
    setGender(formData.gender || "");
    setPaymentMethod(formData.paymentMethod || "");
  }, [formData.gender, formData.paymentMethod]);

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
    if (err.toLowerCase().includes("gender")) {
      focus(genderRef);
    } else if (err.toLowerCase().includes("payment")) {
      focus(paymentRef);
    }
    setTimeout(() => {
      setLocalError("");
    }, 2000);
  };

  const handleGenderChange = (e) => {
    const target = e.target;
    setGender(target.value);
    setLocalError("");
    setFormData((prevData) => ({
      ...prevData,
      gender: target.value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    const target = e.target;
    setPaymentMethod(target.value);
    setLocalError("");
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: target.value,
    }));
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut", staggerChildren: 0.12 },
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
      className="flex flex-col gap-5 w-[70%] mx-auto"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.label
        className="text-2xl font-semibold"
        htmlFor="gender"
        variants={itemVariants}
      >
        Gender
      </motion.label>
      {error || localError ? (
        <motion.span className="text-red-500" variants={itemVariants}>
          {error || localError}
        </motion.span>
      ) : null}
      <motion.div
        className="flex gap-5"
        ref={genderRef}
        variants={itemVariants}
      >
        <motion.label
          htmlFor="gender-male"
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (gender === "Male" ? " bg-green-600 text-white" : "")
          }
          variants={itemVariants}
        >
          <input
            type="radio"
            id="gender-male"
            name="gender"
            value="Male"
            onChange={handleGenderChange}
          />
          Male
        </motion.label>
        <motion.label
          htmlFor="gender-female"
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (gender === "Female" ? " bg-green-600 text-white" : "")
          }
          variants={itemVariants}
        >
          <input
            type="radio"
            id="gender-female"
            name="gender"
            value="Female"
            onChange={handleGenderChange}
          />
          Female
        </motion.label>
      </motion.div>

      <motion.label
        className="text-2xl font-semibold mt-5"
        htmlFor="paymentMethod"
        variants={itemVariants}
      >
        Payment Method
      </motion.label>

      <motion.div
        className="flex gap-5"
        ref={paymentRef}
        variants={itemVariants}
      >
        <motion.label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "M-Pesa" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-mpesa"
          variants={itemVariants}
        >
          <input
            type="radio"
            id="paymentMethod-mpesa"
            name="paymentMethod"
            value="M-Pesa"
            onChange={handlePaymentMethodChange}
          />
          M-Pesa
        </motion.label>

        <motion.label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "Cash" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-cash"
          variants={itemVariants}
        >
          <input
            type="radio"
            id="paymentMethod-cash"
            name="paymentMethod"
            value="Cash"
            onChange={handlePaymentMethodChange}
          />
          Cash
        </motion.label>

        <motion.label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "Card" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-card"
          variants={itemVariants}
        >
          <input
            type="radio"
            id="paymentMethod-card"
            name="paymentMethod"
            value="Card"
            onChange={handlePaymentMethodChange}
          />
          Card
        </motion.label>
      </motion.div>
      {paymentMethod === "M-Pesa" ? (
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-semibold text-2xl" htmlFor="mpesaNumber">
            M-Pesa Number
          </label>
          <input
            type="text"
            id="mpesaNumber"
            placeholder="0700000000"
            value={formData.mpesaNumber}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                mpesaNumber: e.target.value,
              }))
            }
            className="border-2 border-green-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : paymentMethod === "Card" ? (
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-semibold text-2xl" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                cardNumber: e.target.value,
              }))
            }
            className="border-2 border-green-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : paymentMethod === "Cash" ? (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-lg">
            Please proceed to the cashier to make your payment in cash. Once you
            have made the payment, you can return here to complete your
            registration.
          </p>
        </div>
      ) : null}
    </motion.div>
  );
};

export default RegisterGenderPayment;
