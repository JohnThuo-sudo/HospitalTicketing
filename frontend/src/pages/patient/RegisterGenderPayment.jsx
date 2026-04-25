import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const RegisterGenderPayment = ({ formData, setFormData, error, setError }) => {
  const [gender, setGender] = useState(formData.gender || "");
  const [paymentMethod, setPaymentMethod] = useState(
    formData.paymentMethod || "",
  );
  const [mpesaNumber, setMpesaNumber] = useState(formData.mpesaNumber || "");
  const [cardNumber, setCardNumber] = useState(formData.cardNumber || "");
  const [insuranceNumber, setInsuranceNumber] = useState(
    formData.insuranceNumber || "",
  );
  const [localError, setLocalError] = useState("");
  const genderRef = useRef(null);
  const paymentRef = useRef(null);
  const mpesaRef = useRef(null);
  const cardRef = useRef(null);
  const insuranceRef = useRef(null);

  // Sync local state with formData when it changes
  useEffect(() => {
    setGender(formData.gender || "");
    setPaymentMethod(formData.paymentMethod || "");
    setMpesaNumber(formData.mpesaNumber || "");
    setCardNumber(formData.cardNumber || "");
    setInsuranceNumber(formData.insuranceNumber || "");
  }, [
    formData.gender,
    formData.paymentMethod,
    formData.mpesaNumber,
    formData.cardNumber,
    formData.insuranceNumber,
  ]);

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
    } else if (err.toLowerCase().includes("mpesa")) {
      focus(mpesaRef);
    } else if (err.toLowerCase().includes("card")) {
      focus(cardRef);
    } else if (err.toLowerCase().includes("insurance")) {
      focus(insuranceRef);
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

  const handleMpesaChange = (e) => {
    const target = e.target;
    const formattedValue = target.value.replace(/\D/g, "").slice(0, 10);
    target.value = formattedValue;
    setMpesaNumber(target.value);
    setLocalError("");
    setFormData((prevData) => ({
      ...prevData,
      mpesaNumber: target.value,
    }));
  };

  const handleCardChange = (e) => {
    const target = e.target;
    const formattedValue = target.value.replace(/\D/g, "").slice(0, 16);
    target.value = formattedValue;
    setCardNumber(target.value);
    setLocalError("");
    setFormData((prevData) => ({
      ...prevData,
      cardNumber: target.value,
    }));
  };

  const handleInsuranceChange = (e) => {
    const target = e.target;
    setInsuranceNumber(target.value);
    setLocalError("");
    setFormData((prevData) => ({
      ...prevData,
      insuranceNumber: target.value,
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
        <motion.label
          htmlFor="gender-other"
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (gender === "Other" ? " bg-green-600 text-white" : "")
          }
          variants={itemVariants}
        >
          <input
            type="radio"
            id="gender-other"
            name="gender"
            value="Other"
            onChange={handleGenderChange}
          />
          Other
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

        <motion.label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "Insurance" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-insurance"
          variants={itemVariants}
        >
          <input
            type="radio"
            id="paymentMethod-insurance"
            name="paymentMethod"
            value="Insurance"
            onChange={handlePaymentMethodChange}
          />
          Insurance
        </motion.label>
      </motion.div>

      {/* Conditional Payment Details */}
      <AnimatePresence>
        {paymentMethod === "M-Pesa" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.label
              className="text-lg font-semibold block mb-2"
              variants={itemVariants}
            >
              M-Pesa Phone Number
            </motion.label>
            <motion.input
              ref={mpesaRef}
              type="tel"
              placeholder="0712345678"
              value={mpesaNumber}
              onChange={handleMpesaChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              required
              variants={itemVariants}
            />
          </motion.div>
        )}

        {paymentMethod === "Card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.label
              className="text-lg font-semibold block mb-2"
              variants={itemVariants}
            >
              Card Number
            </motion.label>
            <motion.input
              ref={cardRef}
              type="text"
              placeholder="1234567890123456"
              value={cardNumber}
              onChange={handleCardChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              required
              variants={itemVariants}
            />
          </motion.div>
        )}

        {paymentMethod === "Insurance" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.label
              className="text-lg font-semibold block mb-2"
              variants={itemVariants}
            >
              Insurance Policy Number
            </motion.label>
            <motion.input
              ref={insuranceRef}
              type="text"
              placeholder="Enter insurance policy number"
              value={insuranceNumber}
              onChange={handleInsuranceChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              required
              variants={itemVariants}
            />
          </motion.div>
        )}

        {paymentMethod === "Cash" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              variants={itemVariants}
            >
              <p className="text-blue-800">
                Please proceed to the cashier to make your payment in cash. Once
                you have made the payment, you can return here to complete your
                registration.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegisterGenderPayment;
