import { http } from "../http";

export const logout = (refresh_token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .post(
        "auth/logout/",
        {
          refresh: refresh_token,
        },
        { authorization: true },
      )
      .then(() => resolve())
      .catch(reject);
  });
};
