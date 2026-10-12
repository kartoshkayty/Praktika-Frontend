"use client";

import Navigator from "@/components/layout/Navigator";
import TextField from "@/components/ui/TextField";
import { useForm, useSelector } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import z from "zod";
import userIcon from "@/assets/user-icon.svg";
import lockerIcon from "@/assets/locker-icon.svg";
import { Open_Sans } from "next/font/google";
import { passwordResetRequest } from "@/api/verification/password-reset/request";
import { humanError } from "@/helpers/humanError";
import { passwordResetConfirm } from "@/api/verification/password-reset/confirm";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface ForgotPasswordForm {
  email: string;
  code: string;
  password: string;
  password_confirm: string;
}

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["latin", "cyrillic"],
});

export default function ForgotPasswordPage() {
  const [canCodeSend, setCanCodeSend] = useState<boolean>(false);
  const [codeSended, setCodeSended] = useState<boolean>(false);
  const [codeSending, setCodeSending] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const authificated = useAuthStore((state) => state.authificated);
  const router = useRouter();

  const emailValidator = z
    .email("Вкажіть дійсну адресу електронної пошти")
    .regex(/^(\w|.)+@gmail\.com$/, "Дозволено лише скриньки gmail.com");

  const form = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
      password_confirm: "",
    } as ForgotPasswordForm,
    validators: {
      onChange: z
        .object({
          email: emailValidator,
          code: z
            .string()
            .refine(
              (data) => data.length === 6 && !isNaN(parseInt(data)),
              "Код повинен складатися із шести цифр",
            ),
          password: z
            .string("Вкажiть пароль")
            .min(8, "Довжина пароля має бути мінімум 8 символів"),
          password_confirm: z.string("Вкажiть пароль"),
        })
        .refine((data) => data.password === data.password_confirm, {
          error: "Паролі не збігаються",
          path: ["password_confirm"],
        })
        .refine(() => codeSended),
    },

    onSubmit: async ({ value }) => {
      await new Promise<void>((resolve) => {
        passwordResetConfirm({
          email: value.email,
          code: value.code,
          password: value.password,
        })
          .then(() => {
            resolve();
            router.replace("/auth/login");
          })
          .catch((e) => {
            setError(humanError(e));
            resolve();
          });
      });
    },
  });

  const erorrs = useSelector(form.store, (state) => state.errors);
  useEffect(() => console.log(erorrs), [erorrs]);

  const email = useSelector(form.store, (state) => state.values.email);

  const sendCode = () => {
    setCodeSending(true);

    passwordResetRequest(email)
      .then(async () => {
        setCodeSended(true);
        await form.validate("blur");
        setCodeSending(false);
      })
      .catch((e) => {
        setCodeSended(false);
        setError(humanError(e));
        setCodeSending(false);
      });
  };

  useEffect(() => {
    if (authificated) {
      router.replace("/cabinet");
    }
  }, [authificated]);

  return (
    <div>
      <Navigator title="Відновлення пароля" pathName="Відновлення пароля" />

      <div className="my-36 max-w-242.5 w-full mx-auto bg-[#F0F0F0] border-2 border-[#8AA382] rounded-[10px] px-25 pt-20 pb-12">
        {error && (
          <p
            className={`mb-10 text-center ${open_sans.className} text-[16px] text-[#C94C4E]`}
          >
            {error}
          </p>
        )}

        <TextField
          form={form}
          name="email"
          type="text"
          placeholder="Введіть електронну пошту"
          icon={userIcon}
          disabled={codeSended || codeSending}
          listeners={{
            onChange: ({ value }) => {
              try {
                emailValidator.parse(value);
              } catch (e) {
                setCanCodeSend(false);
                return;
              }

              setCanCodeSend(true);
            },
          }}
          additionalButton={{
            text: codeSending
              ? "Відправлення..."
              : !codeSended
                ? "Надіслати код"
                : "Надіслано",
            onClick: () => sendCode(),
            disabled: !canCodeSend || codeSended,
          }}
        />

        <TextField
          form={form}
          name="code"
          type="text"
          placeholder="Введіть код підтвердження"
          icon={userIcon}
          className="mt-20"
        />

        <TextField
          form={form}
          name="password"
          type="password"
          placeholder="Введіть новий пароль"
          className="mt-20"
          icon={lockerIcon}
        />

        <TextField
          form={form}
          name="password_confirm"
          type="password"
          placeholder="Повторіть пароль"
          className="mt-9"
          icon={lockerIcon}
        />

        <form.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <button
              className={`bg-[#8AA382] ${open_sans.className} mt-10 text-white py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
              onClick={() => form.handleSubmit()}
              disabled={!canSubmit}
            >
              Підтвердити
            </button>
          )}
        ></form.Subscribe>
      </div>
    </div>
  );
}
