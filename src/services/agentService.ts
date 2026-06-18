import api from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerAgent = async (agentData: any) => {
  const response = await api.post("https://realestate-backend-bph9.onrender.com/agents/register", agentData);
  return response.data;
};