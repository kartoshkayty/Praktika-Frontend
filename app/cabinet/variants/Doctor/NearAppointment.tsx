import { useDoctorAppointments } from "@/store/doctorAppointments";
import { Inter, Open_Sans } from "next/font/google";
import Image from "next/image";
import kalendarIcon from "@/assets/kalendar-icon.svg";
import clockIcon from "@/assets/clock-icon.svg";
import Loading from "@/components/ui/Loading";

const osans_bold = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const inter_regular = Inter({
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

export function NearAppointment() {
  const appointments = useDoctorAppointments((state) => state.appointments);
  const near = useDoctorAppointments((state) => state.near);

  return appointments && !near ? null : (
    <div className="bg-[#8AA382] pb-15.75 pt-8 relative">
      {!near && (
        <div className="absolute w-full h-full backdrop-blur-sm top-0 flex justify-center items-center">
          <Loading color="white" />
        </div>
      )}

      <h1
        className={`${osans_bold.className} text-center text-white text-[16px]`}
      >
        | Найближчий прийом |
      </h1>

      <div className="flex justify-between max-w-279.5 mx-auto mt-7.5 break-all">
        <article className="bg-white py-10.5 px-12.5 max-w-118.75 w-full rounded-[15px] flex flex-col justify-center">
          <p className={`text-xl text-[#143D39] ${inter_regular.className}`}>
            <span className={inter_bold.className}>Паціент:</span>{" "}
            {near?.patient_name ?? "Ковальчук Олена Василівна"}
          </p>
          <p className={`text-xl text-[#143D39] ${inter_regular.className}`}>
            <span className={inter_bold.className}>Послуга:</span>{" "}
            {near?.service_name ?? "Повторна консультація"}
          </p>
        </article>

        <article
          className={`${inter_bold.className} text-xl text-white flex flex-col justify-center`}
        >
          <div className="flex">
            <Image src={kalendarIcon} alt="kalendar-icon" />
            <p className="ml-2.5">Дата</p>
            <p className="ml-3.5">{near?.date}</p>
          </div>
          <div className="flex mt-5">
            <Image src={clockIcon} alt="clock-icon" />
            <p className="ml-2.5">Час</p>
            <p className="ml-3.5">{near?.time}</p>
          </div>
        </article>

        <article className="bg-white px-15.5 py-14.75 max-w-97.75 w-full rounded-[15px] break-all">
          <p
            className={`${inter_bold.className} text-[#888888] text-[16px] text-center`}
          >
            {near?.description && near.description.length > 0
              ? near.description
              : "Пацієнт не залишив коментар"}
          </p>
        </article>
      </div>
    </div>
  );
}
