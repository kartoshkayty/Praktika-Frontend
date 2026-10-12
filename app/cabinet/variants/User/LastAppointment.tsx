import { MyAppointment, useMyAppointmentsStore } from "@/store/myAppointments";
import { Inter, Open_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import kalendarIcon from "@/assets/kalendar-icon.svg";
import clockIcon from "@/assets/clock-icon.svg";
import doorIcon from "@/assets/door-icon.svg";
import Image from "next/image";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["latin", "cyrillic"],
});

const inter_regular = Inter({
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

export default function LastAppointment() {
  const appointments = useMyAppointmentsStore((state) => state.appointments);
  const getLastAppointment = useMyAppointmentsStore((state) => state.getLast);

  const [appointment, setAppointment] = useState<MyAppointment | undefined>();

  useEffect(() => {
    setAppointment(getLastAppointment());
  }, [appointments]);

  return (
    <div className="bg-[#8AA382] w-full flex flex-col justify-center items-center pt-7.25 pb-13">
      <h1 className={`${open_sans.className} text-[16px] text-white`}>
        | Назначений прийом |
      </h1>

      <div className="flex max-w-214.75 w-full justify-between mt-5.5">
        <article
          className={`${inter_regular.className} bg-white rounded-[15px] py-5.75 px-13.25 text-xl`}
        >
          <p>
            <span className={`${inter_bold.className}`}>Лікар:</span>{" "}
            {appointment?.doctor_name}
          </p>
          <p className={`${inter_bold.className}`}>
            {appointment?.specialization}
          </p>
          <p className="mt-2.5">
            <span className={`${inter_bold.className}`}>Послуга:</span>{" "}
            {appointment?.service_name}
          </p>
        </article>
        <article
          className={`${inter_bold.className} text-white text-xl grid grid-cols-2 grid-rows-3 gap-x-4.75 items-center`}
        >
          <div className="flex items-center">
            <Image src={kalendarIcon} alt="kalendar-icon" />
            <p className="ml-2.5">Дата</p>
          </div>
          <p>{appointment?.date}</p>

          <div className="flex items-center">
            <Image src={clockIcon} alt="clock-icon" />
            <p className="ml-2.5">Час</p>
          </div>
          <p>{appointment?.time}</p>

          <div className="flex items-center">
            <Image src={doorIcon} alt="door-icon" />
            <p className="ml-2.5">Кабінет</p>
          </div>
          <p>№ 15</p>
        </article>
      </div>
    </div>
  );
}
