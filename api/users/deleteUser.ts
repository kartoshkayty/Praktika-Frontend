import { http } from "../http";

export const deleteUser = (id: number | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .delete(`users/${id}/`, { authorization: true })
      .then(() => resolve())
      .catch(reject);
  });
};
