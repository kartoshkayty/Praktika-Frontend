import { http } from "../http";
import { UserData } from "./me/getMe";

export const getUser = (id: number | string): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    http
      .get(`users/${id}/`, { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
