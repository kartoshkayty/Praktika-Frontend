import { http } from "../../http";

export enum UserRole {
  User = "USER",
  Doctor = "DOCTOR",
  Admin = "ADMIN",
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: null | string;
  avatar: null | string;
  role: UserRole;
}

export const getMe = (): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    http
      .get<UserData>("users/me/", {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
