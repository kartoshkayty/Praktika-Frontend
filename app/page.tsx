"use client";

import { useHeightStore } from "@/store/height";
import Background from "../assets/Background.png";
import { Inter, Open_Sans } from "next/font/google";
import TelIcon from "../assets/Telephone.svg";
import Image, { StaticImageData } from "next/image";
import InfoReImg from "../assets/info_rebilitation.png";
import monitPIcon from "../assets/monitor-pulse-icon.svg";
import peopleMIcom from "../assets/people-message-icon.svg";
import myachikBBIcon from "../assets/myachik-bom-bom-icon.svg";
import News from "@/components/news";
import gItem1 from "@/assets/gallery-item-1.png";
import gItem2 from "@/assets/gallery-item-2.png";
import gItem3 from "@/assets/gallery-item-3.png";
import gItem4 from "@/assets/gallery-item-4.png";
import gItem5 from "@/assets/gallery-item-5.png";
import gItem6 from "@/assets/gallery-item-6.png";
import gItem7 from "@/assets/gallery-item-7.png";
import gItem8 from "@/assets/gallery-item-8.png";
import gItem9 from "@/assets/gallery-item-9.png";
import gItem10 from "@/assets/gallery-item-10.png";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic"],
});

const inter_medium = Inter({
  weight: "500",
  subsets: ["cyrillic"],
});

export default function Home() {
  const height = useHeightStore((state) => state.height);

  return (
    <div>
      <div
        className="bg-no-repeat bg-center bg-cover flex flex-col justify-center items-center min-h-93.5 text-white"
        style={{
          height: `calc(100vh - ${height}px)`,
          backgroundImage: `url("${Background.src}")`,
        }}
      >
        <div className={`text-[#8AA382] text-[16px] ${open_sans.className}`}>
          | Ласкаво Просимо |
        </div>
        <div
          className={`text-white text-5xl font-bold text-center max-w-280 mt-5`}
        >
          КНТ “СПЕЦІАЛІЗОВАНИЙ МЕДИКО-РЕАБІЛІТАЦІЙНИЙ ЦЕНТР ДЛЯ ДІТЕЙ ТА
          ПІДЛІТКІВ” ДОР”
        </div>
        <div className={`${open_sans.className} text-[16px] mt-6.5`}>
          З турботою про кожну дитину.
        </div>
        <div className="flex mt-6.5">
          <a
            className={`${open_sans.className} text-[16px] py-4 px-7.5 bg-[#8DA382] rounded-lg transition-colors duration-300 hover:bg-white hover:text-black`}
            href=""
          >
            Наші Послуги
          </a>
          <a className="flex ml-6.25 items-center" href="tel:+3800637960148">
            <Image src={TelIcon} alt="tel" />
            <div className={`ml-2.25 ${open_sans.className} hover:underline`}>
              Подзвоніть Нам
            </div>
          </a>
        </div>
      </div>

      <div id="info" className="flex pt-27.5 w-max mx-auto">
        <div className="w-137.5 h-86.75 bg-[#D9D9D966] flex justify-center items-center">
          <Image src={InfoReImg} alt="info-re-img" loading="eager" />
        </div>
        <div>
          <div
            className={`${open_sans.className} text-[16px] ml-6.25 text-[#8AA382]`}
          >
            | Про Нас |
          </div>
          <div className="mt-5 ml-5 max-w-137.5">
            <div className={`mt-5 font-bold text-4xl ${inter_bold.className}`}>
              Інформація про медичнi та реабілітаційні послуги в КНТ
            </div>
            <div className={`text-[#6E6E6E] mt-2.5 ${inter_medium.className}`}>
              В 2025 році КНТ «СМРЦДП»ДОР» працює за Програмою медичних гарантій
              для пацієнта. Укладені договори за пакетами медичних послуг НЗСУ:
              <br />–   Реабілітаційна допомога дорослим і дітям у амбулаторних
              умовах;
              <br />–   Реабілітаційна допомога дорослим і дітям у стаціонарних
              умовах;
              <br />–   Медична реабілітація немовлят, які народилися передчасно
              та/або хворими, протягом перших трьох років життя;
              <br />–   Профілактика, діагностика, спостереження та лікування в
              амбулаторних умовах.
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-33.75 w-max mx-auto text-4xl ${inter_bold.className}`}
      >
        МЕДИЧНІ ТА РЕАБІЛІТАЦІЙНІ ПОСЛУГИ
      </div>

      <div className="flex justify-center mt-14.75">
        <div>
          <div
            className="ml-5 bg-[#D9D9D966] px-14 py-11.25"
            style={{
              backgroundImage: `url('${(peopleMIcom as StaticImageData).src}')`,
              backgroundRepeat: "no-repeat",
              backgroundPositionX: 315,
              backgroundPositionY: 27,
              boxShadow: "0px 4px 4px 0px #00000033",
            }}
          >
            <h1
              className={`text-[#8DA382] text-xl ${inter_bold.className} text-center`}
            >
              Консультативні послуги
            </h1>
            <p
              className={`${inter_medium.className} text-[16px] text-[#6E6E6E] mt-5.75 max-w-109.75`}
            >
              &middot; Консультація лікаря невролога дитячого
              <br />
              &middot; Консультація лікаря психіатра дитячого
              <br />
              &middot; Консультація лікаря ортопеда-травматолога дитячого
              <br />
              &middot; Консультація лікаря пульмонолога дитячого
              <br />
              &middot; Консультація лікаря педіатра
              <br />
              &middot; Консультація лікаря кардіоревматолога дитячого
              <br />
              &middot; Консультація лікаря гастроентеролога дитячого
              <br />
              &middot; Консультація лікаря з фізіотерапії
              <br />
              &middot; Консультація лікаря фізичної та реабілітаційної медицини
            </p>
          </div>

          <div
            className="ml-5 bg-[#D9D9D966] pl-21.5 pr-6.25 py-18.75 mt-30.75"
            style={{
              backgroundImage: `url('${(myachikBBIcon as StaticImageData).src}')`,
              backgroundRepeat: "no-repeat",
              backgroundPositionX: 337,
              backgroundPositionY: 11,
              boxShadow: "0px 4px 4px 0px #00000033",
            }}
          >
            <h1
              className={`text-[#8DA382] text-xl ${inter_bold.className} text-center`}
            >
              Реабілітаційні послуги
            </h1>
            <p
              className={`${inter_medium.className} text-[16px] text-[#6E6E6E] mt-5.75 max-w-109.75`}
            >
              &middot; Фізична терапія (заняття з фізичним терапевтом)
              <br />
              &middot; Ерготерапія (заняття з ерготерапевтом)
              <br />
              &middot; Сенсорна та соціальна інтеграція (арт-терапія,
              музикотерапія, ігротерапія)
              <br />
              &middot; Масаж
              <br />
              &middot; Заняття з логопедом
              <br />
              &middot; Заняття з дефектологом
              <br />
              &middot; Заняття з психологом
            </p>
          </div>
        </div>
        <div
          className="ml-5 bg-[#D9D9D966] px-24 py-17 h-max mt-44.5"
          style={{
            backgroundImage: `url('${(monitPIcon as StaticImageData).src}')`,
            backgroundRepeat: "no-repeat",
            backgroundPositionX: 259,
            backgroundPositionY: 27,
            boxShadow: "0px 4px 4px 0px #00000033",
          }}
        >
          <h1
            className={`text-[#8DA382] text-xl ${inter_bold.className} text-center`}
          >
            Діагностичні послуги
          </h1>
          <p
            className={`${inter_medium.className} text-[16px] text-[#6E6E6E] mt-5.75`}
          >
            &middot; УЗД черевної порожнини
            <br />
            &middot; УЗД нирок
            <br />
            &middot; УЗД щитоподібної залози
            <br />
            &middot; Електрокардіографія
            <br />
            &middot; Електроенцефалографія
            <br />
            &middot; Бронхоспірографія
            <br />
            &middot; Провокаційний інгаляційний тест
            <br />
            &middot; Спірометрія з фізичним навантаженням
          </p>
        </div>
      </div>

      <div className="bg-[#F0F0F0] mt-32.5 flex flex-col items-center">
        <h1
          id="news"
          className={`${open_sans.className} text-[#8AA382] mt-27.5`}
        >
          | Новини |
        </h1>
        <hgroup className="text-center mt-6">
          <h1 className={`${inter_bold.className} text-4xl`}>
            Життя центру та медицина
          </h1>
          <p
            className={`mt-7.75 ${inter_medium.className} text-[16px] text-[#6E6E6E]`}
          >
            Будьте в курсі важливих оновлень, державних програм та соціальних
            ініціатив.
          </p>
        </hgroup>

        <News />
      </div>

      <div className="mt-63.5 flex flex-col justify-center items-center">
        <h1
          id="gallery"
          className={`text-[16px] text-[#8AA382] ${open_sans.className}`}
        >
          | Галерея |
        </h1>
        <h1 className={`mt-11.5 text-4xl ${inter_bold.className}`}>
          Тепло, турбота та розвиток
        </h1>

        <ul
          className="grid w-full mt-8"
          style={{
            gridTemplateRows: "repeat(7, 1fr)",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          <li
            style={{
              backgroundImage: `url('${gItem1.src}')`,
              aspectRatio: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-xl text-center text-[#6E6E6E] ${inter_medium.className}`}
            >
              «Щаслива дитина — головна мета нашей работы»
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem2.src}')`,
              aspectRatio: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-xl text-center text-[#6E6E6E] ${inter_medium.className}`}
            >
              «Простір, де панує турбота та підтримка»
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem3.src}')`,
              aspectRatio: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-xl text-center text-[#6E6E6E] ${inter_medium.className}`}
            >
              «Кожен день — це маленький крок до великих перемог»
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem4.src}')`,
              aspectRatio: 2,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              gridColumnStart: 1,
              gridColumnEnd: 3,
            }}
          ></li>
          <li
            style={{
              backgroundImage: `url('${gItem5.src}')`,
              aspectRatio: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-xl text-center text-[#6E6E6E] ${inter_medium.className}`}
            >
              «Безбар'єрність у кожній деталі»
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem6.src}')`,
              aspectRatio: 2,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              gridColumnStart: 2,
              gridColumnEnd: 4,
            }}
          ></li>
          <li
            style={{
              backgroundImage: `url('${gItem7.src}')`,
              aspectRatio: 2,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              gridColumnStart: 1,
              gridColumnEnd: 3,
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-xl text-center text-[#6E6E6E] ${inter_medium.className}`}
            >
              «Безпечне середовище для гармонійного розвитку»
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem8.src}')`,
              aspectRatio: 2,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              gridColumnStart: 1,
              gridColumnEnd: 3,
            }}
          ></li>
          <li
            style={{
              backgroundImage: `url('${gItem9.src}')`,
              aspectRatio: 1,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></li>
          <li className="bg-[#F0F0F0] flex justify-center items-center aspect-square">
            <p
              className={`max-w-72 text-[16px] text-center text-[#94A98A] ${open_sans.className}`}
            >
              КНТ “СПЕЦІАЛІЗОВАНИЙ МЕДИКО-РЕАБІЛІТАЦІЙНИЙ ЦЕНТР ДЛЯ ДІТЕЙ ТА
              ПІДЛІТКІВ” ДОР”
            </p>
          </li>
          <li
            style={{
              backgroundImage: `url('${gItem10.src}')`,
              aspectRatio: 2,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              gridColumnStart: 2,
              gridColumnEnd: 4,
            }}
          ></li>
        </ul>
      </div>
      <div className="pt-22.75 bg-[#94A98A]"></div>
    </div>
  );
}
