import { Doctor, getDoctors } from "@/api/doctors/getDoctors";
import { create } from "zustand";

interface DoctorsStore {
  doctors?: Doctor[];
  set: (doctors: Doctor[]) => Doctor[];
  fetch: () => Promise<Doctor[]>;
}

export const useDoctors = create<DoctorsStore>((set) => ({
  doctors: undefined,
  set: (doctors: Doctor[]) => {
    set({ doctors });
    return doctors;
  },
  fetch: async () => {
    const doctors = await getDoctors().catch(() => []);

    set({ doctors });
    return doctors;
  },
}));
