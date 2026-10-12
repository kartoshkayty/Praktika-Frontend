import { Service } from "../doctors/getDoctorServices";
import { http } from "../http";

export const getServices = (): Promise<Service[]> => {
  return new Promise((resolve, reject) => {
    http
      .get("services/", { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
