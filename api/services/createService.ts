import { Service } from "../doctors/getDoctorServices";
import { http } from "../http";

interface CreateServicePayload extends Omit<Service, "id"> {}

export const createService = (
  payload: CreateServicePayload,
): Promise<Service> => {
  return new Promise((resolve, reject) => {
    http
      .post("services/", payload, { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
