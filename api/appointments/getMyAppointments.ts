import { MyAppointment } from "@/store/myAppointments";
import { http } from "../http";

export const getMyAppointments = (): Promise<MyAppointment[]> => {
  return new Promise((resolve, reject) => {
    http
      .get("appointments/my/", { authorization: true })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
