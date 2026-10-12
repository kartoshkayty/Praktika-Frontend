import { http } from "@/api/http";

export const passwordResetRequest = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .post("verification/password-reset/request/", { email })
      .then(() => resolve())
      .catch(reject);
  });
};
