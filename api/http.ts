"use client";

import { getAuthData } from "@/helpers/authStorage";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { getActualTokens } from "./events";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;
export const http = axios.create({ baseURL });

http.interceptors.request.use(async (config) => {
  const tokens = await getActualTokens();
  if (config.authorization && tokens.access_token) {
    config.headers["Authorization"] = `Bearer ${tokens.access_token}`;
  }

  return config;
});

http.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.status !== HttpStatusCode.Unauthorized) {
      throw error;
    }

    useAuthStore.setState({
      refresh_token: undefined,
      access_token: undefined,
      authificated: false,
    });

    window.location.replace("/auth/login");

    throw error;
  },
);

// deprecated

// http.interceptors.response.use(
//   (r) => r,
//   async (error: AxiosError) => {
//     const refresh_token = getAuthData()?.refresh_token;

//     if (refresh_token && error.status === HttpStatusCode.Unauthorized) {
//       console.log("detected 401, trying refreshing token...");

//       const response = await axios
//         .post(baseURL + "auth/token/refresh/", {
//           refresh: refresh_token,
//         })
//         .catch(() => undefined);

//       if (response && response.status === HttpStatusCode.Ok) {
//         console.log("susccess refreshing tokens: ", response.data);
//         useAuthStore.getState().setAuthData({
//           access_token: response.data.access_token,
//           refresh_token: response.data.refresh_token,
//         });

//         return;
//       }

//       console.log("failed to refresing token: ", response);

//       useAuthStore.getState().setAuthData(undefined);
//       useAuthStore.getState().setAuthificated(false);
//       useUserStore.getState().setData(undefined);
//     }
//   },
// );
