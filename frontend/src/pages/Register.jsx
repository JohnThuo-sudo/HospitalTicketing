import React, { useState } from "react";
import RegisterNames from "./patient/RegisterNames";
import RegisterPhoneDOB from "./patient/RegisterPhoneDOB";
import RegisterGenderPayment from "./patient/RegisterGenderPayment";
import RegisterConfirm from "./patient/RegisterConfirm";
import { AnimatePresence, motion, stagger } from "framer-motion";

const Register = () => {
  const steps = [
    {
      id: 1,
      name: "Names",
      component: RegisterNames,
    },
    {
      id: 2,
      name: "Contact Details",
      component: RegisterPhoneDOB,
    },
    {
      id: 3,
      name: "Gender and Payment",
      component: RegisterGenderPayment,
    },
    {
      id: 4,
      name: "Confirm Details",
      component: RegisterConfirm,
    },
  ];

  const [step, setStep] = useState(steps[0].id);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    lastName: "",
    phone: "",
    DOB: "",
    gender: "",
    paymentMethod: "",
    mpesaNumber: "",
    cardNumber: "",
  });

  const validateStep = () => {
    const handleError = (err) => {
      setError(err);
      setTimeout(() => setError(""), 2000);
    };

    if (step === 1) {
      if (!formData.firstName) {
        handleError("First name is required");
        return false;
      }
      if (!formData.surName) {
        handleError("Sur name is required");
        return false;
      }
      if (!formData.lastName) {
        handleError("Last name is required");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.phone) {
        handleError("Phone number is required");
        return false;
      }
      if (!formData.DOB) {
        handleError("Date of birth is required");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.gender) {
        handleError("Gender is required");
        return false;
      }
      if (!formData.paymentMethod) {
        handleError("Payment method is required");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step === 3) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: `${prevData.firstName} ${prevData.surName} ${prevData.lastName}`,
      }));
    }

    if (step < steps.length) {
      setStep(step + 1);
      return;
    }

    if (step === steps.length) {
      console.log("Form submitted:", formData);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const CurrentComponent = steps.find((s) => s.id === step)?.component;

  const stepVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      <form
        action=""
        method="post"
        className="flex flex-col w-[80%] mx-auto gap-4 mt-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-cente ml-[15%]">
            Register for a Ticket
          </h1>
        </div>
        <AnimatePresence mode="wait">
          {CurrentComponent && (
            <motion.div
              key={step}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <CurrentComponent
                formData={formData}
                setFormData={setFormData}
                error={error}
                setError={setError}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-[70%] mx-auto flex justify-end gap-2">
          {step > 1 && (
            <button
              className={
                "mt-12 bg-blue-500 w-48 h-10 rounded-lg font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 text-2xl cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
            >
              Back
            </button>
          )}
          <button
            className="mt-12 bg-blue-500 w-48 h-10 rounded-lg font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 text-2xl cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              nextStep();
              console.log(step);
            }}
          >
            {step === steps.length ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
