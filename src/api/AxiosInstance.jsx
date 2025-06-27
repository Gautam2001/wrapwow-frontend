import axios from "axios";
import { usePopup } from "../Pages/GlobalFunctions/GlobalPopup/GlobalPopupContext";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 150000,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData") ?? "null");

    const token = loginData?.token;
    const allowedUrls = [
      "member/landingPageData",
      "/user/signup",
      "/member/login",
      "/member/sendOtp",
      "/member/validateOtp",
      "/member/forgotPassword",
      "/images/**",
    ];

    if (!allowedUrls.some((url) => config.url.includes(url)) && !token) {
      window.location.href = "/login";
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );

    const { showPopup } = usePopup();

    if (error.code === "ECONNABORTED") {
      showPopup("Request timed out. Please try again.", "error");
      return Promise.reject(new Error("Request timed out"));
    }

    if (error.response?.status === 401) {
      showPopup("Unauthorized. Please log in again.", "error");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
