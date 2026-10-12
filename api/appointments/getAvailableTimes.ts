import { http } from "../http";

export const getAvailableTimes = (
  doctorId: string | number,
  date: string,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    http
      .get(`appointments/available-times/?doctor=${doctorId}&date=${date}`, {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
