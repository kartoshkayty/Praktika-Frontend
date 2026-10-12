import { normalizeAvatar } from "@/store/user";
import { http } from "../http";
import { UserData } from "./me/getMe";

export interface EditUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone?: string;
  email?: string;
  password?: string;
}

export const editUser = (
  userId: string | number,
  payload: EditUserPayload,
): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    http
      .put(
        `users/${userId}/`,
        { ...payload, password2: payload.password },
        { authorization: true },
      )
      .then((res) =>
        resolve({ ...res.data, avatar: normalizeAvatar(res.data.avatar) }),
      )
      .catch(reject);
  });
};
