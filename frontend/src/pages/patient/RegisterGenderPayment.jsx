import React, { useState } from 'react'

const RegisterGenderPayment = () => {
    const [gender, setGender] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const handleGenderChange = (e) => {
        const target = e.target;
        setGender(target.value);
    };

    const handlePaymentMethodChange = (e) => {
        const target = e.target;
        setPaymentMethod(target.value);
        console.log(paymentMethod);
    };

  return (
    <div className="flex flex-col gap-5 w-[70%] mx-auto">
      <label className="text-2xl font-semibold" htmlFor="gender">
        Gender
      </label>
      <div className="flex gap-5">
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

      <div className="flex gap-5">
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
    </div>
  );
}

export default RegisterGenderPayment