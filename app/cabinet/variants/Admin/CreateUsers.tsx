import { UserRole } from "@/api/users/me/getMe";
import TextField from "@/components/ui/TextField";
import { useForm, useSelector } from "@tanstack/react-form";
import { Inter, Open_Sans } from "next/font/google";
import z from "zod";
import userIcon from "@/assets/user-icon.svg";
import emailIcon from "@/assets/email-icon.svg";
import phoneIcon from "@/assets/phone-icon.svg";
import lockerIcon from "@/assets/locker-icon.svg";
import { useEffect, useState } from "react";
import { Service } from "@/api/doctors/getDoctorServices";
import { getServices } from "@/api/services/getServices";
import Image from "next/image";
import trashIcon from "@/assets/trash-icon.svg";
import Loading from "@/components/ui/Loading";
import { createService } from "@/api/services/createService";
import { deleteService } from "@/api/services/deleteService";
import { FormMessage } from "../../Settings/MainSettingsForm";
import { createUser } from "@/api/users/createUser";
import { useUsersStore } from "@/store/users";
import { humanError } from "@/helpers/humanError";
import { createDoctor } from "@/api/doctors/createDoctor";

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});
const osans_bold = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

interface CreateUserForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;

  specialization: string;
  experience: string;
  cabinet: string;
  service_name: string;
}

export function CreateUsers() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);

  const [selectedServicesIds, setSelectedServicesIds] = useState<number[]>([]);

  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

  const addUser = useUsersStore((state) => state.add);

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      phone: "",
      password: "",
      role: UserRole.User,

      specialization: "",
      experience: "",
      cabinet: "",
      service_name: "",
    } as CreateUserForm,
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
          role: z.enum(UserRole, ""),

          specialization: z.string(),
          experience: z.string(),
          cabinet: z.string(),
          service_name: z.string(),
        })
        .refine(
          (data) =>
            data.role !== UserRole.Doctor || data.specialization.length > 0,
          {
            error: "Введіть спеціалізацію",
            path: ["specialization"],
          },
        )
        .refine(
          (data) =>
            data.role !== UserRole.Doctor ||
            (data.experience.length > 0 && !isNaN(parseInt(data.experience))),
          {
            error: "Досвід роботи має бути числом",
            path: ["experience"],
          },
        )
        .refine(
          (data) => data.role !== UserRole.Doctor || data.cabinet.length > 0,
          {
            error: "Вкажіть кабінет",
            path: ["cabinet"],
          },
        ),
    },

    onSubmit: async ({ value, formApi }) => {
      setFormLoading(true);

      await new Promise((resolve, reject) => {
        switch (value.role) {
          case UserRole.User: {
            createUser({
              first_name: value.first_name,
              last_name: value.last_name,
              middle_name: value.middle_name,
              email: value.email,
              password: value.password,
              phone: value.phone.length === 0 ? undefined : value.phone,
            })
              .then((res) => {
                addUser(res);
                setFormLoading(false);
                setFormMessage({
                  text: "Ви успішно створили користувача",
                  type: "success",
                });
              })
              .catch((e) => {
                setFormMessage({
                  text: humanError(e),
                  type: "error",
                });
              });
            break;
          }

          case UserRole.Doctor: {
            createDoctor({
              first_name: value.first_name,
              last_name: value.last_name,
              middle_name: value.middle_name,
              email: value.email,
              password: value.password,
              phone: value.phone.length === 0 ? undefined : value.phone,
              specialization: value.specialization,
              cabinet: value.cabinet,
              experience: parseInt(value.experience),
              description: "s",
              services: selectedServicesIds,
            })
              .then((res) => {
                addUser({
                  first_name: res.first_name,
                  last_name: res.last_name,
                  middle_name: res.middle_name,
                  phone: value.phone.length === 0 ? null : value.phone,
                  id: res.id,
                  role: UserRole.Doctor,
                  email: res.email,
                  avatar: res.photo,
                });
                setFormLoading(false);
                setFormMessage({
                  text: "Ви успішно створили користувача",
                  type: "success",
                });
              })
              .catch((e) => {
                setFormMessage({
                  text: humanError(e),
                  type: "error",
                });
              });
            break;
          }
        }
      });
    },
  });

  const onClickService = (service: Service) => {
    if (selectedServicesIds.includes(service.id)) {
      setSelectedServicesIds(
        selectedServicesIds.filter((s) => s !== service.id),
      );
      return;
    }

    setSelectedServicesIds([...selectedServicesIds, service.id]);
  };

  const newServiceName = useSelector(
    form.store,
    (state) => state.values.service_name,
  );

  const addService = () => {
    setServicesLoading(true);

    createService({
      name: newServiceName,
      description: "description",
      is_active: true,
    })
      .then((service) => {
        setServices([...services, service]);
        setServicesLoading(false);
        form.setFieldValue("service_name", "");
      })
      .catch(() => undefined);
  };

  const removeService = (service: Service) => {
    deleteService(service.id)
      .then(() => {
        setSelectedServicesIds(
          selectedServicesIds.filter((s) => s !== service.id),
        );
        setServices(services.filter((s) => s.id !== service.id));
      })
      .catch(() => undefined);
  };

  const selectedRole = useSelector(form.store, (state) => state.values.role);

  useEffect(() => {
    if (selectedRole !== UserRole.Doctor) return;
    setServicesLoading(true);

    getServices()
      .then((res) => {
        setServices(res.filter((s) => s.is_active));
        setServicesLoading(false);
      })
      .catch((e) => undefined);
  }, [selectedRole]);

  return (
    <div className="bg-white pt-22 pb-24">
      <h1 className={`${inter_bold.className} text-center text-[#8AA382]`}>
        | Створення користувача |
      </h1>

      <div className="border-2 border-[#8aa382] max-w-242.5 relative w-full mx-auto mt-18 rounded-[10px] bg-[#F0F0F0] px-25 pt-9 pb-16">
        {(formLoading || formMessage !== null) && (
          <div className="absolute top-0 left-0 rounded-[10px] w-full h-full z-50 flex justify-center items-center flex-col bg-[#F0F0F0]">
            {formLoading && <Loading />}
            {formMessage !== null && (
              <div className="flex flex-col items-center">
                <p
                  className={`text-xl ${osans_bold.className} text-center`}
                  style={{
                    color:
                      formMessage.type === "success" ? "#8AA382" : "#C94C4E",
                  }}
                >
                  {formMessage.text}
                </p>
                <button
                  className={`${inter_bold.className} mt-20 text-white h-max bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
                  onClick={() => {
                    form.reset();
                    setSelectedServicesIds([]);
                    setServices([]);
                    setFormMessage(null);
                    setFormLoading(false);
                  }}
                >
                  Закрити
                </button>
              </div>
            )}
          </div>
        )}

        <h1 className={`${inter_bold.className} text-xl text-[#6E6E6E]`}>
          Основні
        </h1>

        <div className="flex w-full mt-2.5">
          <TextField
            form={form}
            type="text"
            name="first_name"
            placeholder="Введіть ім’я"
            icon={userIcon}
            className="w-full"
          />

          <TextField
            form={form}
            type="text"
            name="last_name"
            placeholder="Введіть Прізвище"
            className="w-full ml-7"
          />
        </div>

        <TextField
          form={form}
          type="text"
          name="middle_name"
          placeholder="Введіть по батькові"
          className="mt-9"
        />

        <TextField
          form={form}
          type="text"
          name="email"
          placeholder="Введіть електронну пошту"
          className="mt-9"
          icon={emailIcon}
        />

        <TextField
          form={form}
          type="text"
          name="phone"
          placeholder="Введіть номер телефону  (необов'язково)"
          className="mt-9"
          icon={phoneIcon}
        />

        <TextField
          form={form}
          type="text"
          name="password"
          placeholder="Введіть пароль"
          className="mt-9"
          icon={lockerIcon}
        />

        <h1
          className={`${inter_bold.className} text-xl text-[#6E6E6E] ml-2.5 mt-9`}
        >
          Роль
        </h1>

        <form.Field
          name="role"
          children={(field) => (
            <div
              className={`${inter_bold.className} text-[16px] mt-2.5 text-[#6E6E6E] ${servicesLoading ? "opacity-65 cursor-not-allowed" : ""}`}
            >
              <div className="flex">
                <input
                  id="user"
                  type="radio"
                  name="role"
                  value={UserRole.User}
                  disabled={servicesLoading || field.form.state.isSubmitting}
                  defaultChecked
                  className="appearance-none rounded-full border-2 border-white outline-2 outline-[#8AA382] h-max p-1.75 checked:bg-[#8AA382] transition-colors duration-300 ease-out"
                  onChange={(e) =>
                    field.handleChange(e.target.value as UserRole)
                  }
                />
                <p className="ml-2.5">Користувач</p>
              </div>

              <div className="flex mt-2.5">
                <input
                  id="doctor"
                  type="radio"
                  name="role"
                  disabled={servicesLoading || field.form.state.isSubmitting}
                  value={UserRole.Doctor}
                  className="appearance-none rounded-full border-2 border-white outline-2 outline-[#8AA382] h-max p-1.75 checked:bg-[#8AA382] transition-colors duration-300 ease-out"
                  onChange={(e) =>
                    field.handleChange(e.target.value as UserRole)
                  }
                />
                <p className="ml-2.5">Лiкар</p>
              </div>
            </div>
          )}
        />

        <hr className="h-0.5 bg-[#8AA382] mt-8" />

        <h1
          className={`${inter_bold.className} text-xl text-[#6E6E6E] mt-5.25`}
        >
          Для лікаря
        </h1>

        <form.Subscribe
          selector={(state) => state.values.role}
          children={(role) => (
            <div className="relative">
              {role !== UserRole.Doctor && (
                <div className="bg-[#F0F0F0] absolute w-full h-full z-50 opacity-35 cursor-not-allowed"></div>
              )}

              <div className="flex mt-2.5">
                <TextField
                  form={form}
                  name="specialization"
                  type="text"
                  placeholder="Введіть спеціалізацію"
                  className="w-full"
                  disabled={role !== UserRole.Doctor || servicesLoading}
                />

                <TextField
                  form={form}
                  name="experience"
                  type="text"
                  placeholder="Введіть досвід роботи"
                  className="w-full ml-13"
                  disabled={role !== UserRole.Doctor || servicesLoading}
                />
              </div>

              <div className="flex mt-8">
                <TextField
                  form={form}
                  name="service_name"
                  type="text"
                  placeholder="Введіть послугу"
                  className="w-full"
                  disabled={role !== UserRole.Doctor || servicesLoading}
                  additionalButton={{
                    text: "Додати",
                    onClick: () => addService(),
                    disabled: newServiceName.length === 0,
                  }}
                />

                <TextField
                  form={form}
                  name="cabinet"
                  type="text"
                  placeholder="Номер кабінету"
                  className="ml-12 w-[60%]"
                  disabled={role !== UserRole.Doctor || servicesLoading}
                />
              </div>

              <ol className="border-2 border-[#8AA382] h-49 overflow-y-scroll mt-4 relative">
                {servicesLoading ? (
                  <Loading className="absolute top-1/2 left-1/2 -translate-1/2" />
                ) : (
                  services.map((service, index) => (
                    <li
                      key={service.id}
                      style={{
                        backgroundColor: selectedServicesIds.includes(
                          service.id,
                        )
                          ? "#B4EAA2"
                          : index % 2 === 0
                            ? "white"
                            : "#F0F0F0",
                      }}
                      className="py-4 px-6 flex justify-between select-none"
                    >
                      <p
                        onClick={() => onClickService(service)}
                        className={`${osans_bold.className} text-[16px] text-[#6E6E6E] cursor-pointer`}
                      >
                        {service.name}
                      </p>
                      <Image
                        src={trashIcon}
                        className="w-8.5 h-8.5 cursor-pointer"
                        alt="trash-icon"
                        onClick={() => removeService(service)}
                      />
                    </li>
                  ))
                )}
              </ol>
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <button
              className={`${inter_bold.className} text-white mt-8.5 ml-auto w-full bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
              onClick={() => form.handleSubmit()}
              disabled={!canSubmit}
            >
              Створити
            </button>
          )}
        ></form.Subscribe>
      </div>
    </div>
  );
}
