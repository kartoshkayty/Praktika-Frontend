"use client";

import Navigator from "@/components/layout/Navigator";
import TextField from "@/components/ui/TextField";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import userIcon from "@/assets/user-icon.svg";
import phoneIcon from "@/assets/phone-icon.svg";
import emailIcon from "@/assets/email-icon.svg";
import lockerIcon from "@/assets/locker-icon.svg";
import { useEffect, useState } from "react";
import { Open_Sans } from "next/font/google";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { register } from "@/api/auth/register";
import { humanError } from "@/helpers/humanError";

interface RegisterForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
}

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

export default function RegisterPage() {
  const [showPass, setShowPass] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const authificated = useAuthStore((state) => state.authificated);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirm: "",
    } as RegisterForm,
    validators: {
      onChange: z
        .object({
          first_name: z.string("Вкажіть ім'я").min(1, "Вкажіть ім'я"),
          last_name: z.string("Вкажіть прізвище").min(1, "Вкажіть прізвище"),
          middle_name: z
            .string("Вкажіть по батькові")
            .min(1, "Вкажіть по батькові"),
          email: z
            .email("Вкажіть дійсну адресу електронної пошти")
            .regex(/^(\w|.)+@gmail\.com$/, "Дозволено лише скриньки gmail.com"),
          phone: z.string(""),
          password: z
            .string("Вкажiть пароль")
            .min(8, "Довжина пароля має бути мінімум 8 символів"),
          password_confirm: z.string("Вкажiть пароль"),
        })
        .refine((data) => data.password === data.password_confirm, {
          error: "Паролі не збігаються",
          path: ["password_confirm"],
        }),
    },
    onSubmit: async ({ value, formApi }) => {
      await new Promise<void>((resolve) => {
        register({
          ...value,
          phone: value.phone.length === 0 ? null : value.phone,
        })
          .then(() => {
            router.replace("/auth/login");
            resolve();
          })
          .catch((e) => {
            setError(humanError(e));
            resolve();
          });
      });
    },
  });

  useEffect(() => {
    if (authificated) {
      router.replace("/cabinet");
    }
  }, [authificated]);

  return (
    <div>
      <Navigator title="Реєстрація" pathName="Реєстрація" />

      <div className="my-32 max-w-242.5 w-full mx-auto px-25 py-23 bg-[#F0F0F0] border-2 border-[#8AA382] rounded-[10px]">
        {error && (
          <p
            className={`mb-10 text-center ${open_sans.className} text-[16px] text-[#C94C4E]`}
          >
            {error}
          </p>
        )}

        <div className="flex">
          <TextField
            form={form}
            name="first_name"
            type="text"
            placeholder="Вкажіть ім'я"
            className="w-full"
            icon={userIcon}
          />

          <TextField
            form={form}
            name="last_name"
            type="text"
            placeholder="Введіть Прізвище"
            className="w-full ml-6"
          />
        </div>

        <TextField
          form={form}
          name="middle_name"
          type="text"
          placeholder="Введіть по батькові"
          className="w-full mt-9"
        />

        <TextField
          form={form}
          name="email"
          type="text"
          placeholder="Введіть електронну пошту"
          className="w-full mt-9"
          icon={emailIcon}
        />

        <TextField
          form={form}
          name="phone"
          type="text"
          placeholder="Введіть номер телефону  (необов'язково)"
          className="w-full mt-9"
          icon={phoneIcon}
        />

        <TextField
          form={form}
          name="password"
          type="password"
          showPassword={showPass}
          placeholder="Введіть пароль"
          className="w-full mt-9"
          icon={lockerIcon}
        />

        <TextField
          form={form}
          name="password_confirm"
          showPassword={showPass}
          type="password"
          placeholder="Повторіть пароль"
          className="w-full mt-9"
          icon={lockerIcon}
        />

        <div className="flex justify-between mt-6">
          <form.Subscribe
            selector={(state) => state.canSubmit}
            children={(canSubmit) => (
              <button
                className={`bg-[#8AA382] ${open_sans.className} text-white py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
                onClick={() => form.handleSubmit()}
                disabled={!canSubmit}
              >
                Зареєструватися
              </button>
            )}
          ></form.Subscribe>

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
      </div>
    </div>
  );
}
