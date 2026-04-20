import React, { useEffect, useRef, useState } from "react";

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
      element.current.focus();
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

  useEffect(() => {
    setGender(formData.gender || "");
    setPaymentMethod(formData.paymentMethod || "");
  }, [formData.gender, formData.paymentMethod]);

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

  return (
    <div className="flex flex-col gap-5 w-[70%] mx-auto">
      <label className="text-2xl font-semibold" htmlFor="gender">
        Gender
      </label>
      {error || localError ? (
        <span className="text-red-500">{error || localError}</span>
      ) : null}
      <div className="flex gap-5" ref={genderRef}>
        <label
          htmlFor="gender-male"
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (gender === "Male" ? " bg-green-600 text-white" : "")
          }
        >
          <input
            type="radio"
            id="gender-male"
            name="gender"
            value="Male"
            onChange={handleGenderChange}
          />
          Male
        </label>
        <label
          htmlFor="gender-female"
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (gender === "Female" ? " bg-green-600 text-white" : "")
          }
        >
          <input
            type="radio"
            id="gender-female"
            name="gender"
            value="Female"
            onChange={handleGenderChange}
          />
          Female
        </label>
      </div>

      <label className="text-2xl font-semibold mt-5" htmlFor="paymentMethod">
        Payment Method
      </label>

      <div className="flex gap-5" ref={paymentRef}>
        <label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "M-Pesa" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-mpesa"
        >
          <input
            type="radio"
            id="paymentMethod-mpesa"
            name="paymentMethod"
            value="M-Pesa"
            onChange={handlePaymentMethodChange}
          />
          M-Pesa
        </label>

        <label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "Cash" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-cash"
        >
          <input
            type="radio"
            id="paymentMethod-cash"
            name="paymentMethod"
            value="Cash"
            onChange={handlePaymentMethodChange}
          />
          Cash
        </label>

        <label
          className={
            "px-8 py-2 rounded-md border-2 border-green-600 cursor-pointer" +
            (paymentMethod === "Card" ? " bg-green-600 text-white" : "")
          }
          htmlFor="paymentMethod-card"
        >
          <input
            type="radio"
            id="paymentMethod-card"
            name="paymentMethod"
            value="Card"
            onChange={handlePaymentMethodChange}
          />
          Card
        </label>
      </div>
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
    </div>
  );
};

export default RegisterGenderPayment;
