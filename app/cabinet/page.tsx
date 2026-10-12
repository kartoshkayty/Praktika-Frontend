"use client";

import { getMe, UserRole } from "@/api/users/me/getMe";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef } from "react";
import AdminCabinet from "./variants/Admin";
import DoctorCabinet from "./variants/Doctor";
import UserCabinet from "./variants/User";
import Navigator from "@/components/layout/Navigator";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import fallbackAvatar from "@/assets/fallback-ava.png";
import { Inter } from "next/font/google";
import { makeFirstSymbolUpper } from "@/helpers/literal";
import { changeAvatar } from "@/api/users/me/changeAvatar";
import SettingsForm from "./Settings/SettingsForm";

const inter_medium = Inter({
  weight: "500",
  subsets: ["cyrillic"],
});

export default function Cabinet() {
  const router = useRouter();
  const isAuthificated = useAuthStore((state) => state.authificated);

  const creds = useUserStore(
    useShallow((state) => ({
      first: makeFirstSymbolUpper(state.data?.first_name),
      last: makeFirstSymbolUpper(state.data?.last_name),
      middle: makeFirstSymbolUpper(state.data?.middle_name),
    })),
  );

  const role = useUserStore((state) => state.data?.role);
  const email = useUserStore((state) => state.data?.email);
  const avatarUrl = useUserStore((state) => state.data?.avatar);

  const setAvatar = useUserStore((state) => state.setAvatar);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      !event.target.files ||
      event.target.files.length > 1 ||
      event.target.files.length === 0
    ) {
      alert("Ви вибрали занадто багато файлів або не вибрали жодного!");
      return;
    }

    const file = event.target.files[0];

    if (file.type !== "image/png") {
      alert("Підтримуються лише зображення з розширенням png!");
      return;
    }

    changeAvatar(file)
      .then(() => {
        getMe().then((data) => {
          setAvatar(data.avatar);
          alert("Ви успішно оновили аватарку.");
        });
      })
      .catch(() => {
        alert("Не вдалося оновити аватарку.");
      });
  };

  useEffect(() => {
    if (!isAuthificated) {
      router.replace("/auth/login");
    }
  }, [isAuthificated]);

  return (
    <div className="bg-[#F0F0F0] pb-24">
      <input
        type="file"
        accept="image/png"
        ref={inputFileRef}
        className="hidden"
        onChange={(e) => onSelect(e)}
      />
      <Navigator title={"Особистий кабінет"} pathName={"Мій кабінет"} />
      <div className="py-14.5 px-63.75 bg-white flex">
        <div className="w-29.5 h-29.5 rounded-full bg-black">
          <Image
            className="w-29.5 h-29.5 rounded-full hover:opacity-70 transition-opacity duration-300"
            width={118}
            height={118}
            src={avatarUrl ?? fallbackAvatar}
            alt="avatar"
            onClick={() => inputFileRef.current?.click()}
          />
        </div>
        <article
          className={`${inter_medium.className} flex flex-col justify-end ml-5.5`}
        >
          <p className="mb-3.25 text-[25px] text-black">
            {creds.last} {creds.first} {creds.middle}
          </p>
          <span className="mb-2.75 text-[18px] text-[#888888]">{email}</span>
        </article>
      </div>
      {role === UserRole.Admin ? (
        <AdminCabinet />
      ) : role === UserRole.Doctor ? (
        <DoctorCabinet />
      ) : (
        <UserCabinet />
      )}
      <SettingsForm />
    </div>
  );
}
