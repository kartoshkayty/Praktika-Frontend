import { DoctorAppointment } from "@/store/doctorAppointments";
import { http } from "../http";

export const getAppointmentsByDoctor = (
  doctorId: number,
): Promise<DoctorAppointment[]> => {
  return new Promise((resolve, reject) => {
    http
      .get(`appointments/doctors/${doctorId}`, { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
