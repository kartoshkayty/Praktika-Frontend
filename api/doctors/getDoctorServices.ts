import { http } from "../http";

export interface Service {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export type GetDoctorServicesResponse = Service[];

export const getDoctorServices = (
  doctorId: number | string,
): Promise<GetDoctorServicesResponse> => {
  return new Promise((resolve, reject) => {
    http
      .get(`doctors/${doctorId}/services/`, {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
