import { http } from "@/api/http";

export const emailChangeConfirm = (code: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .post(
        "verification/email-change/confirm/",
        {
          code,
        },
        { authorization: true },
      )
      .then(() => resolve())
      .catch(reject);
  });
};
