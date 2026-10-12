import { http } from "../http";

export interface LoginPayload {
  login: string;
  password: string;
}

export interface SuccessLoginResponse {
  access: string;
  refresh: string;
}

export const login = (data: LoginPayload): Promise<SuccessLoginResponse> => {
  return new Promise((resolve, reject) => {
    http
      .post("auth/login/", data)
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
