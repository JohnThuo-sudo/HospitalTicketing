import api from "./axios";
export const createPatientTicket = async (payload) => {
  const response = await api.post("/patients/register", payload);
  return response.data;
};
export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};
export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};
export const submitVitals = async (ticketId, payload) => {
  const response = await api.post(`/tickets/${ticketId}/triage`, payload);
  return response.data;
};
export const submitDiagnosis = async (ticketId, payload) => {
  const response = await api.post(`/tickets/${ticketId}/doctor`, payload);
  return response.data;
};
export const pharmacyComplete = async (ticketId, payload) => {
  const response = await api.post(`/tickets/${ticketId}/pharmacy`, payload);
  return response.data;
};
