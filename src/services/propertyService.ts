import api from "./api";

export const getAllProperties = async () => {
  const response = await api.get("https://realestate-backend-bph9.onrender.com/api/properties");
  return response.data;
};

export const deleteProperty = async (id: number) => {
  const response = await api.delete(`/api/properties/${id}`);
  return response.data;
};

export const getPropertyById = async (id: number) => {
  const response = await api.get(`/api/properties/${id}`);
  return response.data;
};