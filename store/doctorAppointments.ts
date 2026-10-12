import { getDoctorAppointments } from "@/api/doctors/appointments/getDoctorAppointments";
import { create } from "zustand";

export interface DoctorAppointment {
  id: number;
  doctor: number;
  doctor_name: string;
  patient: number;
  patient_name: string;
  // d
  service: number;
  service_name: string;
  date: string;
  time: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface DoctorAppointmentsStore {
  appointments?: DoctorAppointment[];
  near?: DoctorAppointment;

  set: (appointments: DoctorAppointment[]) => DoctorAppointment[];
  fetch: () => Promise<DoctorAppointment[]>;
}

function sortAppointments(appts: DoctorAppointment[]): DoctorAppointment[] {
  return appts.sort(
    (a, b) =>
      new Date([a.date, a.time].join(" ")).getTime() -
      new Date([b.date, b.time].join(" ")).getTime(),
  );
}

export const useDoctorAppointments = create<DoctorAppointmentsStore>((set) => ({
  appointments: undefined,
  near: undefined,

  set: (appts: DoctorAppointment[]) => {
    const sorted = sortAppointments(appts).filter((d) => d.is_active);

    set({
      appointments: sorted,
      near: sorted.length > 0 ? sorted[0] : undefined,
    });
    return sorted;
  },
  fetch: async () => {
    const appts = await getDoctorAppointments().catch(() => []);
    const sorted = sortAppointments(appts).filter((d) => d.is_active);

    set({
      appointments: sorted,
      near: sorted.length > 0 ? sorted[0] : undefined,
    });
    return sorted;
  },
}));
