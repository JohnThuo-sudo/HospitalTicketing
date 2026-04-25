import React, { useState } from "react";
import RegisterNames from "./patient/RegisterNames";
import RegisterPhoneDOB from "./patient/RegisterPhoneDOB";
import RegisterGenderPayment from "./patient/RegisterGenderPayment";
import RegisterConfirm from "./patient/RegisterConfirm";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPatientTicket } from "../api/ticketApi";
import { UserStar } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const SuccessAnimation = ({ ticketNumber, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-green-500 flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-white"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <h1 className="text-6xl font-bold mb-4">SUCCESS!</h1>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p className="text-2xl mb-8">Your ticket has been created</p>
          <div className="bg-white text-green-600 rounded-lg p-8">
            <p className="text-lg mb-2">Ticket Number</p>
            <p className="text-8xl font-bold">{ticketNumber}</p>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.3 }}
          className="mt-8 text-xl"
        >
          Click anywhere to continue
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const  LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-white"
      >
        <LoadingSpinner />

      </motion.div>
    </motion.div>
  );
};

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  

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
    insuranceNumber: "",
  });

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // Reset form and navigate to home
    setFormData({
      firstName: "",
      surName: "",
      lastName: "",
      phone: "",
      DOB: "",
      gender: "",
      paymentMethod: "",
      mpesaNumber: "",
      cardNumber: "",
      insuranceNumber: "",
    });
    setStep(steps[0].id);
    navigate("/");
  };

  const validateStep = () => {
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
      // Validate payment details based on method
      if (formData.paymentMethod === "M-Pesa" && !formData.mpesaNumber) {
        handleError("M-Pesa phone number is required");
        return false;
      }
      if (formData.paymentMethod === "Card" && !formData.cardNumber) {
        handleError("Card number is required");
        return false;
      }
      if (formData.paymentMethod === "Insurance" && !formData.insuranceNumber) {
        handleError("Insurance policy number is required");
        return false;
      }
    }

    return true;
  };

  const nextStep = async () => {
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
      try {
        setIsLoading(true);
        const response = await createPatientTicket(formData);
        if(response) {
          setIsLoading(false);
          const ticket = response.ticket;
          const patient = response.patient;
          setTicketNumber(ticket.ticket_number);
          setShowSuccess(true);
          console.log(response);          
        }

      } catch (err) {
        console.log(err);
        handleError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create ticket",
        );
      }
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

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && ticketNumber && (
          <SuccessAnimation
            ticketNumber={ticketNumber}
            onComplete={handleSuccessComplete}
          />
        )}
      </AnimatePresence>
      {/* Loading Animation*/}
      <AnimatePresence>
        {isLoading && (
          <LoadingAnimation />
        )}
      </AnimatePresence>
    </>
  );
};

export default Register;
