import { API_URL } from "@/constants/env";
import axios from "axios";

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/token`, {
    username,
    password,
  });
  return response.data;
};

export const refresh = async (refreshToken: string) => {
  const response = await axios.post(`${API_URL}/auth/refresh`, {
    refresh: refreshToken,
  });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};

export const introspect = async (token: string) => {
  const response = await axios.post(`${API_URL}/auth/introspect`, { token });
  return response.data;
};
