import { http } from "../http";
import { UserData } from "./me/getMe";

export const getUsers = (): Promise<UserData[]> => {
  return new Promise((resolve, reject) => {
    http
      .get("users/", { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
