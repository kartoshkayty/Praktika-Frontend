"use client";

import Navigator from "@/components/layout/Navigator";
import Field from "@/components/ui/TextField";
import { useForm } from "@tanstack/react-form";
import { Open_Sans } from "next/font/google";
import z from "zod";
import userIcon from "@/assets/user-icon.svg";
import lockerIcon from "@/assets/locker.svg";
import { useEffect, useState } from "react";
import { login } from "@/api/auth/login";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic"],
});

export interface LoginForm {
  login: string;
  password: string;
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const authificated = useAuthStore((state) => state.authificated);
  const setAuthificated = useAuthStore((state) => state.setAuthificated);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const validatior = z.object({
    login: z
      .email("Вкажіть валідну поштову адресу")
      .regex(/^(\w|.)+@gmail\.com$/, "Дозволено лише скриньки gmail.com"),
    password: z.string({ error: "вкажіть пароль" }).min(4, {
      error: "Занадто короткий пароль",
    }),
  });

  const form = useForm({
    defaultValues: {
      login: "",
      password: "",
    } satisfies LoginForm,
    validators: { onChange: validatior },
    onSubmit: async (props) => {
      setError(null);

      login({ login: props.value.login, password: props.value.password })
        .then((res) => {
          setAuthData({ access_token: res.access, refresh_token: res.refresh });
          setAuthificated(true);

          window.location.reload();
        })
        .catch((err) => {
          const error = err as AxiosError<{ non_field_errors?: string[] }>;
          const text =
            error.response?.data?.["non_field_errors"]?.[0] ??
            "Сталася непередбачена помилка";

          setError(text);
          form.reset();
        });
    },
  });

  useEffect(() => {
    if (authificated) {
      router.replace("/cabinet");
    }
  }, [authificated]);

  return (
    <main>
      <Navigator title={"Особистий кабінет"} pathName={"Мій кабінет"} />
      <div className="bg-white pt-15.5 pb-33.25">
        <h1
          className={`${open_sans.className} text-[16px] text-[#8AA382] text-center`}
        >
          | Вхід у кабінет |
        </h1>
        <div className="bg-[#F0F0F0] relative border-2 border-[#8AA382] mt-15 px-25 pt-22 pb-29.75 rounded-[10px] max-w-242.5 w-full mx-auto">
          <p
            className={`${open_sans.className} text-[#C94C4E] text-[16px] text-center absolute z-50 top-6 transition-all duration-300 ease-in-out`}
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              opacity: error ? "100%" : "0%",
              visibility: error ? "visible" : "hidden",
            }}
          >
            {error}
          </p>

          <Field
            form={form}
            name="login"
            type="text"
            icon={userIcon}
            placeholder="Введіть номер телефону або електронну пошту"
            className="max-w-3xl"
          />
          <Field
            form={form}
            name="password"
            type="password"
            showPassword={showPass}
            icon={lockerIcon}
            placeholder="Введіть пароль"
            className="max-w-3xl mt-10.25"
          />
          <div
            className={`mt-3.5 select-none ${open_sans.className} text-[16px] text-[#6E6E6E] flex justify-between mx-2.5`}
          >
            <Link href="/auth/forgot-password">Забули пароль?</Link>
            <div
              className={`${open_sans.className} text-[16px] text-[#6E6E6E] flex items-center`}
            >
              <p>Показати пароль</p>
              <input
                type="checkbox"
                className="ml-2.5 appearance-none rounded-none border-2 border-[#8AA382] py-1.75 px-1.75 transition-colors duration-300 ease-in-out"
                onChange={() => setShowPass(!showPass)}
                style={{
                  backgroundColor: showPass ? "#8AA382" : "#F0F0F0",
                }}
              />
            </div>
          </div>
          <div
            className={`${open_sans.className} text-white flex justify-between items-center mt-5`}
          >
            <a
              href="/auth/register"
              className={`bg-[#8AA382] py-2.5 px-16 rounded-[9px]`}
            >
              Створити акаунт
            </a>
            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit) => (
                <button
                  className={`bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
                  onClick={() => form.handleSubmit()}
                  disabled={!canSubmit}
                >
                  Вхід
                </button>
              )}
            ></form.Subscribe>
          </div>
        </div>
      </div>
    </main>
  );
}
