import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, HeartPulse } from "lucide-react";

const Ticket = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
  });

  const birthTimestamp = Date.now() - 12 * 5400000000;

  const data = {
    full_name: "John Smith Doe",
    phone: "07238945248",
    dob: new Date(birthTimestamp).toLocaleDateString(),
    age: Math.floor(
      (Date.now() - birthTimestamp) / (1000 * 60 * 60 * 24 * 365.25),
    ),
    gender: "Male",
  };

  // Convert object → array for mapping
  const patientFields = [
    { label: "Full Name", value: data.full_name },
    { label: "Phone", value: data.phone },
    { label: "Date of Birth", value: data.dob },
    { label: "Age", value: `${data.age} years` },
    { label: "Gender", value: data.gender },
  ];

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;

    setVitals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitVitals = (e) => {
    e.preventDefault();

    console.log("Vitals Submitted:", vitals);

    setIsModalOpen(false);

    setVitals({
      temperature: "",
      bloodPressure: "",
      heartRate: "",
    });
  };

  return (
    <div className="p-8 bg-blue-100/40 min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <h1 className="font-bold text-3xl text-gray-800">Patient Ticket</h1>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
            Active Case
          </div>
        </motion.div>

        {/* Patient Card */}
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
          >
            <div>
              <h2 className="font-semibold text-2xl mb-6 text-gray-700">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patientFields.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="font-medium text-gray-600">
                      {item.label}
                    </label>

                    <input
                      type="text"
                      value={item.value}
                      disabled
                      className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-700 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-2xl mb-6 text-gray-700">
                Triage Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tria.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="font-medium text-gray-600">
                      {item.label}
                    </label>

                    <input
                      type="text"
                      value={item.value}
                      disabled
                      className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-700 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.main>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
          >
            <HeartPulse size={18} />
            Fill Vitals
          </button>

          <Link to="/triageinfo">
            <button className="bg-gray-200 hover:bg-gray-300 transition-all duration-300 px-6 py-3 rounded-xl font-semibold">
              View Triage Info
            </button>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[90%] md:w-[500px] rounded-3xl shadow-2xl p-8 relative"
            >
              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>

              <h2 className="font-bold text-2xl mb-6 text-gray-800">
                Fill Patient Vitals
              </h2>

              <form
                onSubmit={handleSubmitVitals}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Temperature (°C)</label>
                  <input
                    type="text"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleVitalsChange}
                    className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="36.5"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={vitals.bloodPressure}
                    onChange={handleVitalsChange}
                    className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120/80"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Heart Rate (BPM)</label>
                  <input
                    type="text"
                    name="heartRate"
                    value={vitals.heartRate}
                    onChange={handleVitalsChange}
                    className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="72"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-2 transition"
                >
                  Submit Vitals
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ticket;
