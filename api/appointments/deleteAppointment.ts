import { http } from "../http";

export const deleteAppointment = (appointmentId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .delete(`appointments/${appointmentId}/`, { authorization: true })
      .then(() => resolve())
      .catch(reject);
  });
};
