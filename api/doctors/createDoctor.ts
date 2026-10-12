import { http } from "../http";
import { CreateUserPayload } from "../users/createUser";
import { Doctor } from "./getDoctors";

export interface CreateDoctorPayload extends CreateUserPayload {
  specialization: string;
  description: string;
  experience: number;
  cabinet: string;
  services: number[];
}

export const createDoctor = (payload: CreateDoctorPayload): Promise<Doctor> => {
  return new Promise((resolve, reject) => {
    http
      .post("doctors/", payload, { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
