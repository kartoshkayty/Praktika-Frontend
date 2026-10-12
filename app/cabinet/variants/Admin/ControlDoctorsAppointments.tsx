import Input from "@/components/ui/Input";
import { Inter, Open_Sans, Rajdhani } from "next/font/google";
import loupeIcon from "@/assets/loupe-icon.svg";
import { useDoctors } from "@/store/doctors";
import Image from "next/image";
import fallbackIcon from "@/assets/fallback-ava.png";
import { useEffect, useState } from "react";
import { getDoctorServices, Service } from "@/api/doctors/getDoctorServices";
import { humanError } from "@/helpers/humanError";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { DoctorAppointment } from "@/store/doctorAppointments";
import { getAppointmentsByDoctor } from "@/api/appointments/getAppointmentsByDoctor";
import trashIcon from "@/assets/trash-icon.svg";
import { deleteAppointment } from "@/api/appointments/deleteAppointment";
import Loading from "@/components/ui/Loading";
import { Doctor } from "@/api/doctors/getDoctors";

const osans_bold = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const rajdhani_medium = Rajdhani({
  weight: "500",
  subsets: ["latin"],
});

export function ControlDoctorsAppointments() {
  const doctors = useDoctors((state) => state.doctors);
  const [showDoctors, setShowDoctors] = useState<Doctor[] | undefined>();

  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const [appointmentsLoading, setAppointmentsLoading] =
    useState<boolean>(false);

  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);

  const [error, setError] = useState<string | null>(null);

  const selectDoctor = (doctorId: number) => {
    if (appointmentsLoading) return;
    setAppointmentsLoading(true);
    setSelectedDoctorId(doctorId);

    getAppointmentsByDoctor(doctorId)
      .then((res) => {
        setAppointments(res.filter((a) => a.is_active));
        setAppointmentsLoading(false);
      })
      .catch((e) => {
        const error = humanError(e);
        setError(error);
        setAppointmentsLoading(false);
      });
  };

  const deleteAppointmentClick = (appointmentId: number) => {
    deleteAppointment(appointmentId)
      .then(() => {
        setAppointments(appointments.filter((a) => a.id !== appointmentId));
      })
      .catch((e) => {
        setError(humanError(e));
      });
  };

  const onSearchUpdate = (search: string) => {
    if (!doctors) return;

    if (search.trim().length === 0) {
      setShowDoctors(doctors);
      return;
    }

    setShowDoctors(
      doctors.filter((d) =>
        [d.first_name, d.last_name, d.middle_name].some((n) =>
          n.toLowerCase().startsWith(search.toLowerCase()),
        ),
      ),
    );
  };

  useEffect(() => {
    setShowDoctors(doctors);
  }, [doctors]);

  return (
    <div className="bg-white pt-14 pb-32">
      <h1 className={`${osans_bold.className} text-[#8AA382] w-max mx-auto`}>
        | Управління лікарями |
      </h1>

      <Input
        type="text"
        placeholder="Введіть ім’я лікаря"
        icon={loupeIcon}
        className="max-w-246 mt-14 w-full mx-auto"
        onChange={(e) => onSearchUpdate(e.target.value)}
      />

      <ol className="mt-8 border-2 border-[#8AA382] max-w-279.5 w-full mx-auto">
        {showDoctors?.map((doctor, index) => (
          <li
            key={doctor.id}
            onClick={() => selectDoctor(doctor.id)}
            className={`${osans_bold.className} py-2.5 flex text-[#6E6E6E] text-[16px] justify-between px-10 select-none`}
            style={{
              backgroundColor:
                doctor.id === selectedDoctorId
                  ? "#B4EAA2"
                  : index % 2 === 0
                    ? "#FFFFFF"
                    : "#F0F0F0",
              cursor: appointmentsLoading ? "not-allowed" : "pointer",
              opacity: appointmentsLoading ? "65%" : "100%",
            }}
          >
            <div className="flex">
              <Image
                src={doctor.photo ?? fallbackIcon}
                className="w-11 h-11"
                alt="avatar"
              />

              <div className="ml-6">
                <p>
                  {doctor.last_name} {doctor.first_name} {doctor.middle_name}
                </p>
                <p className={`${rajdhani_medium.className} text-[18px]`}>
                  {doctor.email}
                </p>
              </div>
            </div>

            <p>{doctor.specialization}</p>
          </li>
        ))}
      </ol>

      <h1
        className={`${osans_bold.className} text-[#8AA382] w-max mx-auto mt-14`}
      >
        | Прийоми обраного лікаря |
      </h1>

      <ol className="mt-7 border-2 border-[#8AA382] w-full mx-auto max-w-279.5 h-155.5 overflow-y-auto relative">
        {appointmentsLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
            <Loading />
          </div>
        )}

        {appointments?.map((appointment, index) => (
          <li
            key={appointment.id}
            className={`py-2.5 px-9.75 w-full grid text-[16px] justify-between ${osans_bold.className} text-[#6E6E6E]`}
            style={{
              backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F0F0F0",
              gridTemplateColumns: "15% 45% 30% 10%",
            }}
          >
            <p>
              {format(
                new Date([appointment.date, appointment.time].join(" ")),
                "EEEE",
                { locale: uk },
              )}
            </p>

            <div>
              <p>{appointment.patient_name}</p>
              <p className="mt-1">{appointment.service_name}</p>
            </div>

            <div className="text-right">
              <p>
                {format(
                  new Date([appointment.date, appointment.time].join(" ")),
                  "dd.MM.yyyy",
                )}
              </p>
              <p>{appointment.time}</p>
            </div>

            <Image
              onClick={() => deleteAppointmentClick(appointment.id)}
              className="ml-auto cursor-pointer"
              src={trashIcon}
              alt="trash-icon"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
