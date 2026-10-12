import { useUserStore } from "@/store/user";
import { ControlDoctorsAppointments } from "./ControlDoctorsAppointments";
import { useDoctors } from "@/store/doctors";
import { useEffect } from "react";
import { ControlUsers } from "./ControlUsers";
import { useUsersStore } from "@/store/users";
import { CreateUsers } from "./CreateUsers";

export default function AdminCabinet() {
  const fetchDoctors = useDoctors((state) => state.fetch);
  const fetchUsers = useUsersStore((state) => state.fetch);

  useEffect(() => {
    fetchDoctors();
    fetchUsers();
  }, []);

  return (
    <div className="mb-30">
      <hr className="w-full h-0.5 bg-[#8DA382]" />
      <ControlDoctorsAppointments />
      <ControlUsers />
      <CreateUsers />
    </div>
  );
}
