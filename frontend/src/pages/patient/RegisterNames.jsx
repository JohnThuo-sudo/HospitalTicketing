import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { animate, stagger, motion } from "framer-motion";

const RegisterNames = ({ formData, setFormData, error, setError }) => {
  const [firstName, setFirstName] = useState(formData.firstName || "");
  const [surName, setSurName] = useState(formData.surName || "");
  const [lastName, setLastName] = useState(formData.lastName || "");
  const [localError, setLocalError] = useState("");
  const firstNameRef = useRef(null);
  const surNameRef = useRef(null);
  const lastNameRef = useRef(null);

  // Sync local state with formData when it changes (e.g., when going back)
  useEffect(() => {
    setFirstName(formData.firstName || "");
    setSurName(formData.surName || "");
    setLastName(formData.lastName || "");
  }, [formData.firstName, formData.surName, formData.lastName]);

  const focus = (element) => {
    if (element.current) {
      element.current.focus();
    }
  };

  const removeFocus = (element) => {
    if (element.current) {
      element.current.blur();
    }
  };

  const handleError = (err) => {
    setLocalError(err);
    console.log(err);
    if (err.toLowerCase().includes("first name")) {
      focus(firstNameRef);
    } else if (err.toLowerCase().includes("sur name")) {
      focus(surNameRef);
    } else if (err.toLowerCase().includes("last name")) {
      focus(lastNameRef);
    }
    setTimeout(() => {
      setLocalError("");
    }, 2000);
  };

  const handleFirstNameChange = (e) => {
    const target = e.target;
    setFirstName(target.value);
    setLocalError(""); // Clear error when valid input is entered
  };

  const handleSurNameChange = (e) => {
    const target = e.target;
    if (firstName === "") {
      handleError("First name is required before entering surname");
      target.value = ""; // Clear the input
      setTimeout(() => focus(firstNameRef), 0); // Focus on first name after render
      return;
    }
    setSurName(target.value);
    setLocalError(""); // Clear error when valid input is entered
  };

  const handleLastNameChange = (e) => {
    const target = e.target;
    if (surName === "") {
      handleError("Surname is required before entering last name");
      target.value = ""; // Clear the input
      setTimeout(() => focus(surNameRef), 0); // Focus on surname after render
      return;
    }
    setLastName(target.value);
    setLocalError(""); // Clear error when valid input is entered
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      firstName,
      surName,
      lastName,
    }));
  }, [firstName, surName, lastName, setFormData]);

  const container = {
    initial : {
        opacity: 0,
        y: 20,        
    },
    animate : {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeIn",
            staggerChildren: 0.15
        }
    }
  }

  const item = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        }
    }
  }

  return (
    <motion.div
    className="flex flex-col gap-5 w-[70%] mx-auto"
    variants={container}
    initial="initial"
    animate="animate"
    >
      <h2 className="text-2xl font-bold mb-3">Filling Patient Names</h2>
      {error || localError ? (
        <span className="text-red-500">{error || localError}</span>
      ) : null}

        <Input
            label="First Name"
            placeholder="John"
            value={firstName}
            onChange={handleFirstNameChange}
            required
            ref={firstNameRef}
            variants={item}
        />

      
        <Input
            label="Sur Name"
            placeholder="Smith"
            value={surName}
            onChange={handleSurNameChange}
            required
            ref={surNameRef}
            variants={item}
        />

        <Input
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={handleLastNameChange}
            required
            ref={lastNameRef}
            variants={item}
        />

    </motion.div>
  );
};

export default RegisterNames;
