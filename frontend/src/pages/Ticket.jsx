import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { X, HeartPulse, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  getTicketById,
  pharmacyComplete,
  submitDiagnosis,
  submitVitals,
} from "../api/ticketApi";
import ContactInfoCard from "../components/ContactInfoCard";
import { useNotification } from "../context/NotificationContext";

const Ticket = () => {
  const [isVitalModalOpen, setIsVitalModalOpen] = useState(false);
  const [isVitalInfo, setIsVitalInfo] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const { showSuccess, showError } = useNotification();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingVitals, setSubmittingVitals] = useState(false);
  const [submittingDiagnostics, setSubmittingDiagnostics] = useState(false);
  const [completingPharmacy, setCompletingPharmacy] = useState(false);

  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    description: "",
  });

  const [doctor, setDoctor] = useState({
    diagnosis: "",
    prescription: "",
    description: "",
  });

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      showError("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const changeStatusOnOpen = async () => {
    try {
      console.log("Update status based on role");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Change ticket status when opened based on user role

    if (ticket && ticket.status) {
      changeStatusOnOpen();
    }
  }, [ticket]);

  const handlePharmacy = async () => {
    try {
      setCompletingPharmacy(true);
      await pharmacyComplete(id, {
        verified: true,
        paid: true,
      });

      showSuccess("Pharmacy processing completed!");
      console.log(`Changing ticket ${id} status to completed`);

      // Refresh ticket data
      await fetchTicket();
    } catch (error) {
      console.error("Failed to complete pharmacy:", error);
      showError("Failed to complete pharmacy processing");
    } finally {
      setCompletingPharmacy(false);
    }
  };

  if (!ticket) return null;

  const data = ticket.patient;

  // Calculate age properly
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age === 0) {
      // Calculate months
      const months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        today.getMonth() -
        birthDate.getMonth();
      if (months === 0) {
        // Calculate days
        const days = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        return `${days} days`;
      }
      return `${months} months`;
    }

    return `${age} years`;
  };

  const age = calculateAge(data.dob);

  // Convert object → array for mapping
  const patientFields = [
    { label: "Full Name", value: data.full_name },
    { label: "Phone", value: data.phone_number },
    { label: "Date of Birth", value: data.dob },
    { label: "Age", value: age },
    { label: "Gender", value: data.gender },
  ];

  const vitalFields = [
    { label: "Temperature (°C)", value: ticket.triage?.temperature },
    { label: "Blood Pressure", value: ticket.triage?.bloodPressure },
    { label: "Heart Rate (BPM)", value: ticket.triage?.heartRate },
    { label: "Description", value: ticket.triage?.description },
  ];
  //   const diagnosticFields = [
  //     { label: "Diagnosis", value: "" },
  //     { label: "Prescription", value: "" },
  //     { label: "Description", value: "" },
  //   ];

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;

    setVitals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitVitals = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!vitals.temperature || !vitals.bloodPressure || !vitals.heartRate) {
      showError("Please fill in all required vital signs");
      return;
    }

    try {
      setSubmittingVitals(true);
      await submitVitals(id, vitals);

      showSuccess("Vitals submitted successfully!");
      console.log("Vitals Submitted:", vitals);

      // Close modal and reset form
      setIsVitalModalOpen(false);
      setVitals({
        temperature: "",
        bloodPressure: "",
        heartRate: "",
        description: "",
      });

      // Refresh ticket data
      await fetchTicket();
    } catch (error) {
      console.error("Failed to submit vitals:", error);
      showError(error.response?.data?.message || "Failed to submit vitals");
    } finally {
      setSubmittingVitals(false);
    }
  };

  const handleDiagnosticChange = (e) => {
    const { name, value } = e.target;

    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitDiagnostics = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!doctor.diagnosis || !doctor.prescription) {
      showError("Please fill in diagnosis and prescription");
      return;
    }

    try {
      setSubmittingDiagnostics(true);
      await submitDiagnosis(id, doctor);

      showSuccess("Diagnosis submitted successfully!");
      console.log("Diagnostics Submitted:", doctor);

      // Close modal and reset form
      setIsDiagnosticModalOpen(false);
      setDoctor({
        diagnosis: "",
        prescription: "",
        description: "",
      });

      // Refresh ticket data
      await fetchTicket();
    } catch (error) {
      console.error("Failed to submit diagnostics:", error);
      showError(error.response?.data?.message || "Failed to submit diagnosis");
    } finally {
      setSubmittingDiagnostics(false);
    }
  };

  const handleDownloadReport = () => {
    console.log("Download report");
  };

  const componentVariants = {
    initial: { opacity: 0, x: 200 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -200,
      transition: {
        duration: 0.35,
        ease: "easeIn",
      },
    },
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
          <div className="flex items-baseline gap-6">
            <h1 className="font-bold text-3xl text-gray-800">Patient Ticket</h1>
            <h1 className="font-bold text-4xl"># {ticket.ticket_number}</h1>
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
            {ticket.status}
          </div>
        </motion.div>

        {user.role === "doctor" && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsVitalInfo(false)}
              className={
                isVitalInfo
                  ? " bg-gray-200 hover:bg-gray-300 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
                  : " bg-white cursor-not-allowed px-6 py-3 rounded-xl "
              }
            >
              Contact Info
            </button>
            <button
              onClick={() => setIsVitalInfo(true)}
              className={
                !isVitalInfo
                  ? " bg-gray-200 hover:bg-gray-300 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
                  : " bg-white cursor-not-allowed px-6 py-3 rounded-xl "
              }
            >
              View Triage Info
            </button>
          </div>
        )}

        {user.role === "pharmacist" && (
          <div className="max-w-[500px] flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold">Prescription</h2>
              13
              <p>{ticket.doctor?.prescription}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePharmacy}
                disabled={completingPharmacy}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed text-white p-3 rounded-lg flex items-center justify-center gap-2"
              >
                {completingPharmacy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Mark Paid + Complete"
                )}
              </button>

              <button
                onClick={handleDownloadReport}
                className="bg-purple-500 text-white p-3 rounded-lg"
              >
                Download report
              </button>
            </div>
          </div>
        )}

        {/* Patient Card */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {user.role === "triage" ? (
              <ContactInfoCard patientFields={patientFields} />
            ) : user.role === "doctor" ? (
              !isVitalInfo ? (
                <ContactInfoCard patientFields={patientFields} />
              ) : (
                <motion.main
                  variants={componentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
                >
                  <h2 className="font-semibold text-2xl mb-6 text-gray-700">
                    Triage Info
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vitalFields.map((item, index) => (
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
                </motion.main>
              )
            ) : (
              " "
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {user.role === "triage" ? (
            <button
              onClick={() => setIsVitalModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
            >
              <HeartPulse size={18} />
              Fill Vitals
            </button>
          ) : user.role === "doctor" ? (
            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
            >
              <HeartPulse size={18} />
              Fill Diagnostics
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isVitalModalOpen && user.role === "triage" && (
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
                onClick={() => setIsVitalModalOpen(false)}
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

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Description (more...)</label>
                  <textarea
                    name="description"
                    value={vitals.description}
                    onChange={handleVitalsChange}
                    className="border  p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Give more information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingVitals}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold mt-2 transition flex items-center justify-center gap-2"
                >
                  {submittingVitals ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Vitals"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
        {isDiagnosticModalOpen && user.role === "doctor" && (
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
                onClick={() => setIsDiagnosticModalOpen(false)}
                className="absolute top-5 right-5 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>

              <h2 className="font-bold text-2xl mb-6 text-gray-800">
                Fill Patient Vitals
              </h2>

              <form
                onSubmit={handleSubmitDiagnostics}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Diagnostics</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={doctor.diagnosis}
                    onChange={handleDiagnosticChange}
                    className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="malaria "
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Prescription</label>
                  <input
                    type="text"
                    name="prescription"
                    value={doctor.prescription}
                    onChange={handleDiagnosticChange}
                    className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Chloroquine, Artemether, Atovaquone..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Description (more...)</label>
                  <textarea
                    name="description"
                    value={doctor.description}
                    onChange={handleDiagnosticChange}
                    className="border  p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Give more information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingDiagnostics}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold mt-2 transition flex items-center justify-center gap-2"
                >
                  {submittingDiagnostics ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Diagnostics"
                  )}
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
