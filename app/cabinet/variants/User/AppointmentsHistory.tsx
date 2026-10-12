import { useMyAppointmentsStore } from "@/store/myAppointments";
import { Open_Sans } from "next/font/google";
import miniature from "@/assets/miniature1.png";
import Image from "next/image";
import { formatDate } from "@/helpers/afterDates";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["latin", "cyrillic"],
});

export default function AppointmentsHistory() {
  const appointments = useMyAppointmentsStore((state) => state.appointments);

  return (
    <div className="bg-white pb-15 pt-8 flex justify-center items-center">
      <div className="max-w-276.75 w-full">
        <h1 className={`${open_sans.className} text-[16px] text-[#8AA382]`}>
          | Історія записів |
        </h1>

        <div className="flex mt-7 items-center">
          <ol className="max-w-191.25 w-full h-84 border-2 border-[#8AA382] overflow-y-auto">
            {appointments.map((ament, index) => (
              <li
                key={ament.id}
                className="px-11.25 py-2.5 mx-auto"
                style={{
                  backgroundColor: (index + 1) % 2 === 0 ? "white" : "#F0F0F0",
                }}
              >
                <div
                  className={`${open_sans.className} text-[16px] text-[#6E6E6E] max-w-167 w-full flex justify-between items-center`}
                >
                  <article>
                    <p>{ament.doctor_name}</p>
                    <p>{ament.specialization}</p>
                  </article>

                  <p>{formatDate(ament.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>

          <Image
            src={miniature}
            className="h-63.25"
            width={336}
            height={253}
            alt="miniature"
          />
        </div>
      </div>
    </div>
  );
}
