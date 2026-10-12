import { http } from "../http";
import { UserData } from "./me/getMe";

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone?: string | undefined;
  password: string;
}

export const createUser = (data: CreateUserPayload): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    http
      .post(
        "users/",
        { ...data, password2: data.password },
        { authorization: true },
      )
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
