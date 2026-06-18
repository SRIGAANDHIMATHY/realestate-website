import axios from "axios";

export default axios.create({
  baseURL: "https://realestate-backend-bph9.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

