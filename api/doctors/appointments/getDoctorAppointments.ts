import { http } from "@/api/http";
import { DoctorAppointment } from "@/store/doctorAppointments";

export const getDoctorAppointments = (): Promise<DoctorAppointment[]> => {
  return new Promise((resolve, reject) => {
    http
      .get("doctors/appointments/", { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
