import { changeMe } from "@/api/users/me/changeMe";
import Loading from "@/components/ui/Loading";
import TextField from "@/components/ui/TextField";
import { humanError } from "@/helpers/humanError";
import { makeFirstSymbolUpper } from "@/helpers/literal";
import { useUserStore } from "@/store/user";
import { useForm, useSelector } from "@tanstack/react-form";
import { AxiosError, HttpStatusCode } from "axios";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import z from "zod";

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

interface MainSettingsForm {
  first_name: string;
  last_name: string;
  middle_name: string;

  password: string;
  password_confirm: string;

  phone: string;
}

export interface FormMessage {
  type: "error" | "success";
  text: string;
}

export default function MainSettingsForm() {
  const user = useUserStore.getState().data;

  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const setUserData = useUserStore((state) => state.setData);

  const form = useForm({
    defaultValues: {
      first_name: makeFirstSymbolUpper(user?.first_name ?? ""),
      last_name: makeFirstSymbolUpper(user?.last_name ?? ""),
      middle_name: makeFirstSymbolUpper(user?.middle_name ?? ""),

      password: "",
      password_confirm: "",

      phone: user?.phone ?? "",
    } as MainSettingsForm,
    validators: {
      onChange: z
        .object({
          first_name: z.string().min(1, "Вкажіть ім'я"),
          last_name: z.string().min(1, "Вкажіть прізвище"),
          middle_name: z.string().min(1, "Вкажіть по батькові"),

          password: z
            .string()
            .refine(
              (value) => value.length === 0 || value.length >= 8,
              "Мінімум 8 символів",
            ),
          password_confirm: z.string(),

          phone: z.string(),
        })
        .refine(
          (data) => {
            console.log("tr");
            return (
              (!data.password && !data.password_confirm) ||
              data.password === data.password_confirm
            );
          },
          {
            error: "Паролі не збігаються",
            path: ["password_confirm"],
          },
        ),
    },
    onSubmit: async ({ value }) => {
      await new Promise<void>((submit) => {
        setFormLoading(true);

        changeMe({
          first_name: value.first_name,
          last_name: value.last_name,
          middle_name: value.middle_name,

          new_password:
            value.password.length === 0 ? undefined : value.password,
          new_password_repeat:
            value.password_confirm.length === 0
              ? undefined
              : value.password_confirm,

          phone: value.phone.length === 0 ? null : value.phone,
        })
          .then((res) => {
            setUserData(res);

            setMessage({
              type: "success",
              text: "Ви успішно змінили дані",
            });
            submit();
            setFormLoading(false);
          })
          .catch((err) => {
            if (
              !(err instanceof AxiosError) ||
              err.status !== HttpStatusCode.BadRequest
            ) {
              setMessage({
                type: "error",
                text: "Сталася непередбачена помилка",
              });
              submit();
              setFormLoading(false);
              return;
            }

            setMessage({
              type: "error",
              text: humanError(err.response?.data),
            });
            submit();
            setFormLoading(false);
          });
      });
    },
  });

  const values = useSelector(form.store, (state) => state.values);

  useEffect(() => console.log(values), [values]);

  return (
    <div className="flex flex-col relative">
      <div
        className="flex flex-col justify-center items-center absolute w-[110%] h-[104%] top-0 left-[-5%] backdrop-blur-sm transition-all duration-300 ease-in-out z-50"
        style={{
          visibility: formLoading ? "visible" : "hidden",
          opacity: formLoading ? "100%" : "0%",
        }}
      >
        {formLoading && <Loading />}
      </div>

      {message !== null && (
        <p
          className={`${inter_bold.className} text-[16px] w-full text-center`}
          style={{ color: message.type === "success" ? "#8AA382" : "#C94C4E" }}
        >
          {message.text}
        </p>
      )}

      <h1 className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}>
        Зміна імені
      </h1>

      <div className="flex mt-2.5">
        <TextField
          form={form}
          name="first_name"
          placeholder="Введіть нове і’мя"
          type="text"
          className="w-full"
        />

        <TextField
          form={form}
          name="last_name"
          placeholder="Введіть нове прізвище"
          type="text"
          className="ml-11.75 w-full"
        />
      </div>

      <TextField
        form={form}
        name="middle_name"
        placeholder="Введіть нове по батькові"
        type="text"
        className="mt-10.5 w-full"
      />

      <h1 className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}>
        Зміна пароля
      </h1>

      <div className="flex mt-2.5">
        <TextField
          form={form}
          name="password"
          placeholder="Введіть новий пароль"
          type="text"
          className="w-full"
        />

        <TextField
          form={form}
          name="password_confirm"
          placeholder="Повторіть пароль"
          type="text"
          className="ml-11.75 w-full"
        />
      </div>

      <h1 className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}>
        Додати/Змінити номер телефону
      </h1>

      <TextField
        form={form}
        name="phone"
        placeholder="Введіть номер телефону"
        type="text"
        className="mt-2.5 w-full"
      />

      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <button
            className={`${inter_bold.className} text-white mt-8.5 ml-auto w-max bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
            onClick={() => form.handleSubmit()}
            disabled={!canSubmit}
          >
            Зберегти
          </button>
        )}
      ></form.Subscribe>
    </div>
  );
}
