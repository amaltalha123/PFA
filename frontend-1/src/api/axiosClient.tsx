import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5001/api/auth",
  withCredentials: true, // Pour envoyer les cookies
  
});

export default axiosClient;