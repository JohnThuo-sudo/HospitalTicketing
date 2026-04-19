import React, { useState } from "react";
import RegisterNames from "./patient/RegisterNames";
import RegisterPhoneDOB from "./patient/RegisterPhoneDOB";
import RegisterGenderPayment from "./patient/RegisterGenderPayment";
import RegisterConfirm from "./patient/RegisterConfirm";

const Register = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    lastName: "",
    phone: "",
    DOB: "",
    gender: "",
    paymentMethod: ""
  });


  const steps = [
    {
      id: 1,
      name: "Names",
      component: <RegisterNames />
    },
    {
      id: 2,
      name: "Contact Details",
      component: <RegisterPhoneDOB />
    },
    {
      id: 3,
      name: "Gender and Payment",
      component: <RegisterGenderPayment />
    },
    {
      id: 4,
      name: "Confirm Details",
      component: <RegisterConfirm />
    }
  ]

  const nextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
        {step === 1 && <RegisterNames formData={formData} setFormData={setFormData} />}
        {step === 2 && <RegisterPhoneDOB formData={formData} setFormData={setFormData} />}
        {step === 3 && <RegisterGenderPayment formData={formData} setFormData={setFormData} />}
        {step === 4 && <RegisterConfirm formData={formData} />}
        <div className="w-[70%] mx-auto flex justify-end gap-2">
          {step > 1 &&
          <button
            className={"mt-12 bg-blue-500 w-48 h-10 rounded-lg font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 text-2xl cursor-pointer" }
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              prevStep();
            }}
          >
            Back
          </button>}
          <button
            className="mt-12 bg-blue-500 w-48 h-10 rounded-lg font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors duration-300 text-2xl cursor-pointer"
            
            onClick={(e) => 
            {
              e.preventDefault();
             nextStep();
             console.log(step);
            }
            }
          >
            {step === steps.length ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
