"use client";

import { Open_Sans, Rajdhani } from "next/font/google";
import Image from "next/image";
import Logo from "../../assets/Logo.svg";
import fbIcon from "../../assets/facebook-icon.svg";
import instIcon from "../../assets/instagram-icon.svg";
import { useHeightStore } from "@/store/height";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: "700",
});

const open_sans = Open_Sans({
  subsets: ["cyrillic"],
  weight: "700",
});

export default function Header() {
  const ref = useRef<HTMLHeadElement>(null);
  const pathname = usePathname();

  const setHeight = useHeightStore((state) => state.setHeight);

  const authenticated = useAuthStore((state) => state.authificated);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref} className="text-white">
      <div className="w-full bg-[#8DA382] pt-4 pb-3.25 flex justify-center">
        <div
          className={`max-w-6xl w-full flex justify-between ${rajdhani.className} select-none`}
        >
          <div>(063) 796-01-48</div>
          <div>SANTDET@UKR.NET</div>
        </div>
      </div>
      <div className="bg-[#143D39] py-2.5 flex justify-center">
        <nav className="max-w-275.75 w-full flex justify-between">
          <Link href="/">
            <Image src={Logo} alt="logo" loading="eager" />
          </Link>
          <ul
            className={`flex items-center justify-between w-full max-w-148.5 ${open_sans.className}`}
          >
            <li>
              <Link href="/#gallery">Галерея</Link>
            </li>
            <li>
              <Link href={pathname === "/" ? "#news" : "/news"}>Новини</Link>
            </li>
            <li>
              <Link href="/#info">Інформація</Link>
            </li>
            <li>
              <Link href="/#contacts">Контакти</Link>
            </li>
            <li>
              <Link href={authenticated ? "/cabinet" : "/auth/login"}>
                Мій кабінет
              </Link>
            </li>
          </ul>
          <div className="flex max-w-14.75 w-full justify-between items-center">
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}>
              <Image src={instIcon} alt="instagram" />
            </a>
            <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL}>
              <Image src={fbIcon} alt="facebook" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
