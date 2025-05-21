import axios from "axios";
import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";

export async function getHeaders() {
  const token = await SecureStore.getItemAsync("com.reactexample.token");

  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
}

const api = axios.create({
  baseURL: "http://" + API_URL,
});

export default api;
