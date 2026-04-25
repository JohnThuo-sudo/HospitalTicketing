import api from "./axios";

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const registerStaff = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const createStaffAccount = async (payload) => {
  const response = await api.post("/admin/staff", payload);
  return response.data;
};
