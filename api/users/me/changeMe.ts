import { http } from "@/api/http";
import { UserData } from "./getMe";

interface Me {
  first_name: string;
  last_name: string;
  middle_name: string;

  new_password?: string;
  new_password_repeat?: string;

  phone: string | null;
}

export const changeMe = (body: Me): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    http
      .put("users/me/", body, {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
