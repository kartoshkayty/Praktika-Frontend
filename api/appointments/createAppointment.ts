import { PatientType } from "@/app/cabinet/variants/User/AppoimentForm";
import { http } from "../http";

export interface Appointment {
  doctor: number;
  service: number;
  date: string;
  time: string;
  patient_type: PatientType;
  description?: string;
}

export const createAppointment = (body: Appointment): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    http
      .post("appointments/", body, {
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
