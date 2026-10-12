import { useMyAppointmentsStore } from "@/store/myAppointments";
import AppoimentForm from "./AppoimentForm";
import { useEffect, useState } from "react";
import LastAppointment from "./LastAppointment";
import AppointmentsHistory from "./AppointmentsHistory";

export default function UserCabinet() {
  const appointments = useMyAppointmentsStore((state) => state.appointments);
  const getLastAppointment = useMyAppointmentsStore((state) => state.getLast);

  const [showAppointmentBlock, setShowAppointmentBlock] =
    useState<boolean>(false);

  useEffect(() => {
    setShowAppointmentBlock(getLastAppointment() !== undefined);
  }, [appointments]);

  return (
    <>
      <div className="bg-[#F0F0F0] pt-21.5 pb-35.25">
        <AppoimentForm />
        {showAppointmentBlock && <LastAppointment />}
        <AppointmentsHistory />
      </div>
    </>
  );
}
