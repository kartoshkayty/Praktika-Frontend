import { http } from "../http";

export const deleteService = (serviceId: string | number): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .delete(`services/${serviceId}/`, { authorization: true })
      .then(() => resolve())
      .catch(reject);
  });
};
