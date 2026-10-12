import Input from "@/components/ui/Input";
import { Inter, Open_Sans, Rajdhani } from "next/font/google";
import loupeIcon from "@/assets/loupe-icon.svg";
import { useDoctors } from "@/store/doctors";
import Image from "next/image";
import fallbackIcon from "@/assets/fallback-ava.png";
import { useEffect, useState } from "react";
import { getDoctorServices, Service } from "@/api/doctors/getDoctorServices";
import { humanError } from "@/helpers/humanError";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { DoctorAppointment } from "@/store/doctorAppointments";
import { getAppointmentsByDoctor } from "@/api/appointments/getAppointmentsByDoctor";
import trashIcon from "@/assets/trash-icon.svg";
import { deleteAppointment } from "@/api/appointments/deleteAppointment";
import Loading from "@/components/ui/Loading";
import { Doctor } from "@/api/doctors/getDoctors";
import { UserData } from "@/api/users/me/getMe";
import { getUsers } from "@/api/users/getUsers";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import TextField from "@/components/ui/TextField";
import { FormMessage } from "../../Settings/MainSettingsForm";
import { getUser } from "@/api/users/getUser";
import { useUsersStore } from "@/store/users";
import { deleteUser } from "@/api/users/deleteUser";
import { editUser } from "@/api/users/editUser";

const osans_bold = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const rajdhani_medium = Rajdhani({
  weight: "500",
  subsets: ["latin"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

interface UserEditForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  password: string;
  password_confirm: string;
  phone: string;
  email: string;
}

export function ControlUsers() {
  const users = useUsersStore((state) => state.users);
  const [showUsers, setShowUsers] = useState<UserData[] | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);

  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

  const updateUserState = useUsersStore((state) => state.update);

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      password: "",
      password_confirm: "",
      phone: "",
      email: "",
    } as UserEditForm,
    validators: {
      onChange: z
        .object({
          first_name: z.string("Вкажіть ім'я").min(1, "Вкажіть ім'я"),
          last_name: z.string("Вкажіть прізвище").min(1, "Вкажіть прізвище"),
          middle_name: z
            .string("Вкажіть по батькові")
            .min(1, "Вкажіть по батькові"),
          password: z
            .string()
            .refine(
              (value) => value.length === 0 || value.length >= 8,
              "Мінімум 8 символів",
            ),
          password_confirm: z.string(),
          phone: z.string(),
          email: z
            .email("Вкажіть дійсну адресу електронної пошти")
            .regex(/^(\w|.)+@gmail\.com$/, "Дозволено лише скриньки gmail.com"),
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
      setFormMessage(null);
      setUserDataLoading(true);

      await new Promise<void>((resolve, reject) => {
        editUser(selectedUser!.id, {
          first_name: value.first_name,
          last_name: value.last_name,
          middle_name: value.middle_name,
          phone: value.phone.length === 0 ? undefined : value.phone,
          password: value.password.length === 0 ? undefined : value.password,
          email: value.email.length === 0 ? undefined : value.email,
        })
          .then((r) => {
            updateUserState(selectedUser!.id, r);
            setFormMessage({
              type: "success",
              text: "Користувач успішно оновлено",
            });
            setUserDataLoading(false);
            resolve();
          })
          .catch((e) => {
            setFormMessage({ type: "error", text: humanError(e) });
            setUserDataLoading(false);
            resolve();
          });
      });
    },
  });

  const selectUser = (user: UserData) => {
    setUserDataLoading(true);

    getUser(user.id)
      .then((res) => {
        setSelectedUser(res);
        form.setFieldValue("first_name", res.first_name);
        form.setFieldValue("last_name", res.last_name);
        form.setFieldValue("middle_name", res.middle_name);
        form.setFieldValue("email", res.email);
        form.setFieldValue("phone", res.phone ?? "");
        form.setFieldValue("password", "");
        form.setFieldValue("password_confirm", "");
        setUserDataLoading(false);
      })
      .catch((e) => {
        setError(humanError(e));
        setUserDataLoading(false);
      });
  };

  const removeUserState = useUsersStore((state) => state.remove);

  const deleteUserClick = (userId: number) => {
    deleteUser(userId)
      .then(() => {
        removeUserState(userId);
      })
      .catch((e) => setError(humanError(e)));
  };

  const onSearchUpdate = (prompt: string) => {
    if (prompt.length === 0) {
      setShowUsers(users ?? []);
      return;
    }

    setShowUsers(
      users?.filter((u) =>
        [u.first_name, u.last_name, u.middle_name, u.email].some((o) =>
          o.toLowerCase().startsWith(prompt.toLowerCase()),
        ),
      ) ?? [],
    );
  };

  useEffect(() => {
    setShowUsers(users ?? []);
  }, [users]);

  return (
    <div className="bg-[#F0F0F0] pt-14 pb-32">
      <h1 className={`${osans_bold.className} text-[#8AA382] w-max mx-auto`}>
        | Управління користувачами |
      </h1>

      <Input
        type="text"
        placeholder="Введіть ім’я лікаря"
        icon={loupeIcon}
        className="max-w-246 mt-14 w-full mx-auto"
        onChange={(e) => onSearchUpdate(e.target.value)}
      />

      <ol className="mt-8 border-2 border-[#8AA382] max-w-279.5 w-full mx-auto">
        {showUsers?.map((user, index) => (
          <li
            key={user.id}
            className={`${osans_bold.className} py-2.5 flex text-[#6E6E6E] text-[16px] justify-between px-10 select-none`}
            style={{
              backgroundColor:
                user.id === selectedUser?.id
                  ? "#B4EAA2"
                  : index % 2 === 0
                    ? "#FFFFFF"
                    : "#F0F0F0",

              opacity: userDataLoading ? "65%" : "100%",
            }}
          >
            <div
              className="flex"
              style={{ cursor: userDataLoading ? "not-allowed" : "pointer" }}
              onClick={() => selectUser(user)}
            >
              <Image
                src={user.avatar ?? fallbackIcon}
                className="w-11 h-11 rounded-full"
                width={11}
                height={11}
                alt="avatar"
              />

              <div className="ml-6">
                <p>
                  {user.last_name} {user.first_name} {user.middle_name}
                </p>
                <p className={`${rajdhani_medium.className} text-[18px]`}>
                  {user.email}
                </p>
              </div>
            </div>

            <Image
              onClick={() => deleteUserClick(user.id)}
              className="ml-auto cursor-pointer"
              src={trashIcon}
              alt="trash-icon"
            />
          </li>
        ))}
      </ol>

      {selectedUser && (
        <div className="flex flex-col relative max-w-280 w-full mx-auto bg-white px-16 pt-9 pb-20 mt-24">
          <div
            className="flex flex-col justify-center items-center absolute w-[110%] h-[104%] top-0 left-[-5%] backdrop-blur-sm transition-all duration-300 ease-in-out z-50"
            style={{
              visibility: userDataLoading ? "visible" : "hidden",
              opacity: userDataLoading ? "100%" : "0%",
            }}
          >
            {userDataLoading && <Loading />}
          </div>

          <h1 className={`${osans_bold.className} text-[16px] text-[#8AA382]`}>
            | Налаштування обраного користувача|
          </h1>

          {formMessage !== null && (
            <p
              className={`${inter_bold.className} text-[16px] w-full text-center`}
              style={{
                color: formMessage.type === "success" ? "#8AA382" : "#C94C4E",
              }}
            >
              {formMessage.text}
            </p>
          )}

          <h1
            className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}
          >
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

          <h1
            className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}
          >
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

          <h1
            className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}
          >
            Додати/Змінити номер телефону
          </h1>

          <TextField
            form={form}
            name="phone"
            placeholder="Введіть номер телефону"
            type="text"
            className="mt-2.5 w-full"
          />

          <h1
            className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-10.75`}
          >
            Задати пошту
          </h1>

          <TextField
            form={form}
            name="email"
            placeholder="Введіть нову електронну пошту"
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
      )}
    </div>
  );
}
