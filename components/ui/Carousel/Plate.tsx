import { Inter, Open_Sans } from "next/font/google";
import Fallback from "../../../assets/fallback.png";

export interface PlateProps {
  data: NewsData;
}

interface NewsData {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  link: string;
  createdAt: Date;
}

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const inter_semibold = Inter({
  weight: "600",
  subsets: ["cyrillic", "latin"],
});

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic"],
});

export default function Plate({ data }: PlateProps) {
  return (
    <div
      className="w-106.5 h-128.75 group"
      style={{
        backgroundImage: `url('${data.thumbnailUrl}'), url('${Fallback.src}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-[#143D39B3] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-250 ease-out w-full h-full flex flex-col text-center items-center justify-center">
        <h1 className={`text-white ${inter_bold.className} text-3xl`}>
          {data.title}
        </h1>
        <p className={`${inter_semibold.className} text-[#F0F0F0] mt-4.5`}>
          {data.description.length > 170
            ? data.description.slice(0, 170) + "..."
            : data.description}
        </p>
        <a
          href={data.link}
          className={`py-2.5 px-11.25 mt-7.5 ${open_sans.className} text-[16px] text-white bg-[#8DA382] rounded-[9px] hover:bg-white hover:text-black ease-out transition-all duration-300`}
        >
          Деталі
        </a>
      </div>
    </div>
  );
}
