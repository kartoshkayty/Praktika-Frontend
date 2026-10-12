import { http } from "../http";

export const getAvailableDates = (
  doctorId: number | string,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    http
      .get(`appointments/available-dates?doctor=${doctorId}`, {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
