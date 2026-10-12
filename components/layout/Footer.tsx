import TelephonePic from "../../assets/telephone.png";
import EmailPic from "../../assets/email.png";
import AddressPic from "../../assets/address.png";
import GrafikPic from "../../assets/grafik.png";
import Image from "next/image";
import { Inter, Open_Sans } from "next/font/google";
import FacebookSolid from "@/assets/facebook-solid.svg";
import InstagramSolid from "@/assets/instagram-solid.svg";
import Logo from "@/assets/Logo.svg";
import Call from "@/assets/call.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic"],
});

const inter_medium = Inter({
  weight: "500",
  subsets: ["cyrillic"],
});

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic"],
});

const open_sans_light = Open_Sans({
  weight: "300",
  subsets: ["cyrillic"],
});

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer id="contacts" className="bg-[#143D39] pt-33.75 pb-8.5">
      <div className="max-w-286 w-full mx-auto">
        <div className=" flex w-full">
          <div className="max-w-166.25">
            <h1 className={`text-[16px] text-[#8AA382] ${open_sans.className}`}>
              | Контакти |
            </h1>
            <hgroup className="mt-8.75">
              <h1 className={`text-[40px] text-white ${open_sans.className}`}>
                Зв’яжіться з нами
              </h1>
              <p
                className={`${inter_bold.className} text-[17px] text-[#C5C5C5] mt-8.75`}
              >
                Маєте запитання щодо реабілітації чи запису на прийом? Наші
                фахівці завжди готові допомогти.
              </p>
            </hgroup>
            <p
              className={`${inter_medium.className} text-[16px] text-[#B7B7B7] mt-8.75`}
            >
              В 2025 році КНТ «СМРЦДП»ДОР» працює за Програмою медичних гарантій
              для пацієнта. Укладені договори за пакетами медичних послуг НЗСУ:
              <br />
              –   Реабілітаційна допомога дорослим і дітям у амбулаторних
              умовах;
              <br />
              –   Реабілітаційна допомога дорослим і дітям у стаціонарних
              умовах;
              <br />
              –   Медична реабілітація немовлят, які народилися передчасно
              та/або хворими, протягом перших трьох років життя;
              <br />–   Профілактика, діагностика, спостереження та лікування в
              амбулаторних умовах.
            </p>
            <article className="flex mt-8.75">
              <h1 className={`${open_sans.className} text-[17px] text-white`}>
                Слідкуйте за нами:
              </h1>
              <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} className="ml-4.5">
                <Image src={FacebookSolid} alt="facebook" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                className="ml-4.5"
              >
                <Image src={InstagramSolid} alt="instagram" />
              </a>
            </article>
          </div>
          <div className="mt-3.75 ml-11.5 flex flex-col justify-between max-h-95.75">
            <article className="flex">
              <Image src={TelephonePic} alt="telephone" className="w-14 h-14" />
              <hgroup className="ml-4.25">
                <h1
                  className={`${inter_bold.className} text-[25px] text-white`}
                >
                  Телефон
                </h1>
                <p
                  className={`${open_sans.className} text-[16px] text-[#B7B7B7]`}
                >
                  063-796-01-48
                </p>
              </hgroup>
            </article>
            <article className="flex">
              <Image src={EmailPic} alt="email" className="w-14 h-14" />
              <hgroup className="ml-4.25">
                <h1
                  className={`${inter_bold.className} text-[25px] text-white`}
                >
                  Електронна Пошта
                </h1>
                <p
                  className={`${open_sans.className} text-[16px] text-[#B7B7B7]`}
                >
                  santdet@ukr.net
                </p>
              </hgroup>
            </article>
            <article className="flex">
              <Image src={AddressPic} alt="address" className="w-14 h-14" />
              <hgroup className="ml-4.25">
                <h1
                  className={`${inter_bold.className} text-[25px] text-white`}
                >
                  Адреса
                </h1>
                <p
                  className={`${open_sans.className} text-[16px] text-[#B7B7B7]`}
                >
                  М. Дніпро, ж/м Тополя-2, вул. Тополина 41
                </p>
              </hgroup>
            </article>
            <article className="flex">
              <Image src={GrafikPic} alt="grafik" className="w-14 h-14" />
              <hgroup className="ml-4.25">
                <h1
                  className={`${inter_bold.className} text-[25px] text-white`}
                >
                  Графік Роботи
                </h1>
                <p
                  className={`${open_sans.className} text-[16px] text-[#B7B7B7]`}
                >
                  Пн-Пт: 08:00 – 17:00
                </p>
              </hgroup>
            </article>
          </div>
        </div>
        <div className="mt-16.75 w-full bg-[#265954] h-px"></div>
        <div className="flex mt-11.5 justify-between w-full items-center">
          <Image src={Logo} alt="logo" />
          <nav className="max-w-176 w-full">
            <ul
              className={`flex justify-between ${open_sans.className} text-[#B7B7B7] text-[16px]`}
            >
              <li>
                <Link href="/">Головна</Link>
              </li>
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
                <Link href="/cabinet">Мій кабінет</Link>
              </li>
            </ul>
          </nav>
          <div className="flex">
            <Image src={Call} alt="call-icon" />
            <p
              className={`${open_sans.className} text-[16px] text-[#B7B7B7] ml-2`}
            >
              068-215-08-07
            </p>
          </div>
        </div>
      </div>
      <p
        className={`mt-8.5 w-max mx-auto text-[16px] text-[#B7B7B7] ${open_sans_light.className}`}
      >
        © 2026 КНТ “спеціалізований медико-реабілітаційний центр для дітей та
        підлітків” ДОР”. Всі права захищені.
      </p>
    </footer>
  );
}
