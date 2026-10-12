import { http } from "@/api/http";

export const emailChangeRequest = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .post(
        "verification/email-change/request/",
        {
          new_email: email,
        },
        { authorization: true },
      )
      .then(() => resolve())
      .catch(reject);
  });
};
