import { useEffect } from "react";
import { NearAppointment } from "./NearAppointment";
import { useDoctorAppointments } from "@/store/doctorAppointments";
import { Appointments } from "./Appointments";

export default function DoctorCabinet() {
  const fetchDocAppointments = useDoctorAppointments((state) => state.fetch);

  useEffect(() => {
    fetchDocAppointments().catch(() => undefined);
  }, []);

  return (
    <div className="bg-white pb-20 mb-32">
      <NearAppointment />
      <Appointments />
    </div>
  );
}
