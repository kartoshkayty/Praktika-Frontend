import { getMyAppointments } from "@/api/appointments/getMyAppointments";
import { PatientType } from "@/app/cabinet/variants/User/AppoimentForm";
import { create } from "zustand";

export interface MyAppointment {
  id: number;
  doctor: number;
  doctor_name: string;
  specialization: string;
  service: number;
  service_name: string;
  date: string;
  time: string;
  patient_type: PatientType;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface MyAppointmentsStore {
  appointments: MyAppointment[];
  set: (appointments: MyAppointment[]) => MyAppointment[];
  add: (appointment: MyAppointment) => MyAppointment[];
  getLast: () => MyAppointment | undefined;
  update: () => Promise<MyAppointment[]>;
}

export const useMyAppointmentsStore = create<MyAppointmentsStore>(
  (set, get) => ({
    appointments: [],

    set: (appointments: MyAppointment[]) => {
      const filtered = appointments.filter((a) => a.is_active);

      set({ appointments: filtered });
      return filtered;
    },
    add: (appointment: MyAppointment) => {
      set((state) => ({ appointments: [appointment, ...state.appointments] }));
      return get().appointments;
    },
    getLast: () => {
      const raw = get().appointments;

      if (raw.length === 0) return;

      const sorted = raw
        .filter((ap) => ap.is_active)
        .sort(
          (a, b) =>
            new Date([a.date, a.time].join(" ")).getTime() -
            new Date([b.date, b.time].join(" ")).getTime(),
        );

      return sorted.length === 0 ? undefined : sorted[0];
    },
    update: () => {
      return new Promise((resolve, reject) => {
        getMyAppointments()
          .then((appointments) => {
            const filtered = appointments.filter((a) => a.is_active);

            set({ appointments: filtered });
            resolve(filtered);
          })
          .catch(reject);
      });
    },
  }),
);
