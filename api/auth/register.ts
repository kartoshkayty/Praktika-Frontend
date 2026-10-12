import { http } from "../http";

interface RegisterPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string | null;
  password: string;
}

export const register = (payload: RegisterPayload): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .post("auth/register/", { ...payload, password2: payload.password })
      .then(() => resolve())
      .catch(reject);
  });
};
