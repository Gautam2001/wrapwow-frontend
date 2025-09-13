import { createAxiosInstance } from "./AxiosInstance";

export const useApiClients = () => {
  const loginApi = createAxiosInstance(import.meta.env.VITE_LOGIN_URL);
  const wrapwowApi = createAxiosInstance(import.meta.env.VITE_WRAPWOW_URL);

  return { loginApi, wrapwowApi };
};
