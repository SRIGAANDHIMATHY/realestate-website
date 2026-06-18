import api from "./api";
import axios from "axios";

const API_URL = "https://realestate-backend-bph9.onrender.com/api/admin";

export const getPendingProperties = async () => {
  const response = await axios.get(
    `${API_URL}/pending-properties`
  );
  return response.data;
};

export const approveProperty = async (
  propertyId: number
) => {
  return axios.put(
    `${API_URL}/properties/${propertyId}/approve`
  );
};

export const rejectProperty = async (
  propertyId: number
) => {
  return axios.put(
    `${API_URL}/properties/${propertyId}/reject`
  );
};

export const getDashboardData = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getListingStats = async () => {
  const response = await axios.get(
    `${API_URL}/listing-stats`
  );
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`
  );

  return response.data;
};
export const verifyAgent = async (
  userId: number
) => {
  return axios.put(
    `${API_URL}/agents/${userId}/verify`
  );
};

export const suspendAgent = async (
  userId: number
) => {
  return axios.put(
    `${API_URL}/agents/${userId}/suspend`
  );
};
export const getAgentStats = async () => {
  const response = await api.get(
    "/admin/agent-stats"
  );

  return response.data;
};
export const getAdminProfile = async (id: number) => {
  const response = await fetch(
    `https://realestate-backend-bph9.onrender.com/api/admin/profile/${id}`
  );

  return response.json();
};

export const updateAdminProfile = async (
  id: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const response = await fetch(
    `https://realestate-backend-bph9.onrender.com/api/admin/profile/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

export const changeAdminPassword = async (
  id: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const response = await fetch(
    `https://realestate-backend-bph9.onrender.com/api/admin/profile/${id}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.text();
};