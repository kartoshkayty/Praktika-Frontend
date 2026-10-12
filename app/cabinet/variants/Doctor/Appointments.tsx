import { useDoctorAppointments } from "@/store/doctorAppointments";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Open_Sans } from "next/font/google";
import { useMemo } from "react";

const osans_bold = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

export function Appointments() {
  const appointments = useDoctorAppointments((state) => state.appointments);

  const todayAppointments = useMemo(() => {
    return appointments?.filter(
      (a) => a.date === format(new Date(), "yyyy-MM-dd"),
    );
  }, [appointments]);

  const toWeekAppointments = useMemo(() => {
    const weekEnd = Date.now() + 7 * 24 * 60 * 60 * 1000;
    return appointments?.filter(
      (a) => new Date([a.date, a.time].join(" ")).getTime() < weekEnd,
    );
  }, [appointments]);

  return (
    <div className="mt-16">
      <hgroup
        className={`flex justify-between mx-auto max-w-225 w-full text-[#8AA382] text-xl ${osans_bold.className}`}
      >
        <h1>| Прийоми на сьогодні |</h1>
        <h1>{format(new Date(), "dd.MM.yyyy")}</h1>
      </hgroup>

      <ol className="mt-7 border-2 border-[#8AA382] w-full mx-auto max-w-279.5 h-155.5 overflow-y-auto">
        {todayAppointments?.map((appointment, index) => (
          <li
            key={appointment.id}
            className={`py-2.5 px-9.75 w-full flex text-[16px] ${osans_bold.className} text-[#6E6E6E]`}
            style={{
              backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F0F0F0",
            }}
          >
            <p>{appointment.time}</p>

            <div className="ml-16">
              <p>{appointment.patient_name}</p>
              <p className="mt-1">{appointment.service_name}</p>
            </div>
          </li>
        ))}
      </ol>

      <hgroup
        className={`mt-22 flex justify-between mx-auto max-w-225 w-full text-[#8AA382] text-xl ${osans_bold.className}`}
      >
        <h1>| Прийоми на цей тиждень |</h1>
        <h1>{format(new Date(), "MM.yyyy")}</h1>
      </hgroup>

      <ol className="mt-7 border-2 border-[#8AA382] w-full mx-auto max-w-279.5 h-155.5 overflow-y-auto">
        {toWeekAppointments?.map((appointment, index) => (
          <li
            key={appointment.id}
            className={`py-2.5 px-9.75 w-full grid text-[16px] justify-between ${osans_bold.className} text-[#6E6E6E]`}
            style={{
              backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F0F0F0",
              gridTemplateColumns: "15% 55% 30%",
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
          </li>
        ))}
      </ol>
    </div>
  );
}
