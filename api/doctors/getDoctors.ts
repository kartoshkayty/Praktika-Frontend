import { http } from "../http";
import { Service } from "./getDoctorServices";

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  specialization: string;
  email: string;
  description: string;
  experience: number;
  cabinet: string;
  photo: null | string;
  services: Service[];
  is_active: boolean;
}

export type DoctorsResponse = Doctor[];

export const getDoctors = (): Promise<DoctorsResponse> => {
  return new Promise((resolve, reject) => {
    http
      .get("doctors/", { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
