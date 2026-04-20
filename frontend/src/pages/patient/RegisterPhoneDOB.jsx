import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";

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
      element.current.focus();
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

  useEffect(() => {
    setPhone(formData.phone || "");
    setDOB(formData.DOB || "");
  }, [formData.phone, formData.DOB]);

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

  return (
    <div className="flex flex-col gap-5 w-[70%] mx-auto">
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
      />

      <Input
        label="Date of Birth"
        type="date"
        value={DOB}
        onChange={handleDOBChange}
        required
        ref={dobRef}
      />
    </div>
  );
};

export default RegisterPhoneDOB;
