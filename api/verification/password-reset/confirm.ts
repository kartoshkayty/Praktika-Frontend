import { http } from "@/api/http";

interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  password: string;
}

export const passwordResetConfirm = (
  payload: PasswordResetConfirmPayload,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await http
      .post("verification/password-reset/verify/", {
        email: payload.email,
        code: payload.code,
      })
      .catch(reject);

    http
      .post("verification/password-reset/confirm/", {
        email: payload.email,
        new_password: payload.password,
        new_password_confirm: payload.password,
      })
      .then(() => resolve())
      .catch(reject);
  });
};
