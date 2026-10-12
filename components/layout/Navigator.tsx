import { Inter, Open_Sans } from "next/font/google";
import Link from "next/link";

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic"],
});

const open_sans = Open_Sans({
  weight: "300",
  subsets: ["cyrillic"],
});

export interface NavigatorProps {
  title: string;
  pathName: string;
}

export default function Navigator({ title, pathName }: NavigatorProps) {
  return (
    <div className="py-25 bg-[#143D39] text-white">
      <article className="w-max mx-auto flex flex-col items-center text-center">
        <h1 className={`${inter_bold.className} text-5xl`}>{title}</h1>
        <nav className="mt-9">
          <ol className={`flex ${open_sans.className} text-[16px]`}>
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li className="mx-1.25">&gt;</li>
            <li className="decoration-1 font-bold underline">{pathName}</li>
          </ol>
        </nav>
      </article>
    </div>
  );
}
