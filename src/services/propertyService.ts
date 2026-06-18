import api from "./api";

export const getAllProperties = async () => {
  const response = await api.get("https://realestate-backend-bph9.onrender.com/properties");
  return response.data;
};

export const deleteProperty = async (id: number) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};
export const getListingStats = async () => {
  const response = await api.get(
    "/admin/listing-stats"
  );

  return response.data;
};

export const getPropertyById = async (id: number) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};