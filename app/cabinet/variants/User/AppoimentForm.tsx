import { createAppointment } from "@/api/appointments/createAppointment";
import { getAvailableDates } from "@/api/appointments/getAvailableDates";
import { getAvailableTimes } from "@/api/appointments/getAvailableTimes";
import { Doctor, getDoctors } from "@/api/doctors/getDoctors";
import { getDoctorServices, Service } from "@/api/doctors/getDoctorServices";
import Loading from "@/components/ui/Loading";
import SelectField from "@/components/ui/SelectField";
import { makeFirstSymbolUpper } from "@/helpers/literal";
import { useMyAppointmentsStore } from "@/store/myAppointments";
import { useUserStore } from "@/store/user";
import { useForm, useSelector } from "@tanstack/react-form";
import { Inter, Open_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import z from "zod";
import { useShallow } from "zustand/shallow";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic"],
});

export enum PatientType {
  Self = "SELF",
  Child = "CHILD",
}

export interface AppoimentForm {
  doctor: string;
  service: string;
  date: string;
  time: string;
  patient_type: PatientType;
  description: string;
}

export default function AppoimentForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [serviceLoading, setServiceLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>();

  const [datesLoading, setDatesLoading] = useState<boolean>(false);
  const [dates, setDates] = useState<string[]>();

  const [timesLoading, setTimesLoading] = useState<boolean>(false);
  const [times, setTimes] = useState<string[]>();

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const user = useUserStore(
    useShallow((state) => ({
      first_name: makeFirstSymbolUpper(state.data?.first_name ?? "error"),
      last_name: makeFirstSymbolUpper(state.data?.last_name ?? ""),
      middle_name: makeFirstSymbolUpper(state.data?.middle_name ?? ""),
      phone: state.data?.phone,
    })),
  );

  const selectValidator = (value: string) => value !== "-1" && value.length > 0;

  const validator = z.object({
    doctor: z.string().refine(selectValidator, "Вкажіть лікаря"),
    service: z.string().refine(selectValidator, "Вкажiть послугу"),
    date: z.string().refine(selectValidator, "Вкажiть дату"),
    time: z.string().refine(selectValidator, "Вкажiть час"),
    patient_type: z.any(),
    description: z
      .string()
      .max(250, "Опис не повинен перевищувати 250 символів")
      .min(0),
  });

  const updateAppointments = useMyAppointmentsStore((state) => state.update);

  const form = useForm({
    defaultValues: {
      doctor: "",
      service: "",
      date: "",
      time: "",
      patient_type: PatientType.Self,
      description: "",
    } as AppoimentForm,
    validators: {
      onChange: validator,
    },
    onSubmit: async ({ value }) => {
      const res = await createAppointment({
        doctor: parseInt(value.doctor),
        service: parseInt(value.service),
        date: value.date,
        time: value.time,
        patient_type: value.patient_type,
        description:
          value.description.length > 0 ? value.description : undefined,
      }).catch(() => "Не вдалося створити запис");

      if (typeof res === "string") {
        setMessage(res);
        return;
      }

      updateAppointments()
        .then(() => {
          const doctorData = doctors.find((d) => d.id === res.doctor);
          setMessage(
            `Ви успішно записалися до ${doctorData?.last_name} ${doctorData?.first_name} ${doctorData?.middle_name} на ${res.date} о ${res.time}`,
          );
        })
        .catch(() => {
          const doctorData = doctors.find((d) => d.id === res.doctor);
          setMessage(
            `Ви успішно записалися до ${doctorData?.last_name} ${doctorData?.first_name} ${doctorData?.middle_name} на ${res.date} о ${res.time}`,
          );
        });
    },
  });

  const doctorId = useSelector(form.store, (state) => state.values.doctor);

  const onDoctorSelect = (newValue: string) => {
    const doctorId =
      typeof newValue !== "number" ? parseInt(newValue) : newValue;

    if (doctorId === -1) {
      setServices([]);
      setDates([]);
      setTimes([]);
      return;
    }

    setServiceLoading(true);
    setDatesLoading(true);

    Promise.all([getDoctorServices(doctorId), getAvailableDates(doctorId)])
      .then(([loadedServices, loadedDates]) => {
        setServices(loadedServices);
        setDates(loadedDates);

        setServiceLoading(false);
        setDatesLoading(false);
      })
      .catch(() => {
        setError("Виникла помилка під час завантаження даних");
        setServiceLoading(false);
        setDatesLoading(false);
      });
  };

  const onTimeSelect = (newValue: string) => {
    setTimesLoading(true);

    getAvailableTimes(doctorId, newValue)
      .then((res) => {
        setTimes(res);
        setTimesLoading(false);
      })
      .catch(() => {
        setError("Виникла помилка під час завантаження даних");
        setTimesLoading(false);
      });
  };

  useEffect(() => {
    getDoctors()
      .then((res) => {
        setDoctors(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Не вдалося отримати список лікарів.");
        setLoading(false);
      });
  }, []);

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <div className="bg-white px-16 pt-10 pb-24 max-w-248.25 flex flex-col w-full mx-auto relative mb-35.75">
      {(isSubmitting || message) && (
        <div className="absolute top-0 left-0 w-full h-full z-50 flex-col backdrop-blur-sm flex items-center justify-center">
          {isSubmitting && <Loading />}
          {message && (
            <>
              <div className={`${open_sans.className} text-xl`}>{message}</div>
              <button
                className={`${inter_bold.className} mt-10 text-white h-max bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
                onClick={() => {
                  form.reset();
                  setServices([]);
                  setDates([]);
                  setTimes([]);
                  setDoctors([]);
                  setMessage(null);
                  getDoctors()
                    .then((res) => {
                      setDoctors(res);
                      setLoading(false);
                    })
                    .catch(() => {
                      setError("Не вдалося отримати список лікарів.");
                      setLoading(false);
                    });
                }}
              >
                Закрити
              </button>
            </>
          )}
        </div>
      )}
      {loading ? (
        <Loading className="mx-auto" />
      ) : error ? (
        <div
          className={`${open_sans.className} text-[16px] text-red-600 text-center`}
        >
          {error}
        </div>
      ) : (
        <>
          <span className={`${open_sans.className} text-[#8AA382] text-[16px]`}>
            | Запис до лікаря |
          </span>

          <h1
            className={`${inter_bold.className} my-2.5 ml-1 text-xl text-[#6E6E6E]`}
          >
            Лікар/Послуга
          </h1>

          <div className="flex">
            <SelectField
              form={form}
              name={"doctor"}
              placeholder={"Оберіть лікаря"}
              className="max-w-141.5 w-full"
              disabled={timesLoading}
              listeners={{
                onChange: (event) => onDoctorSelect(event.value),
              }}
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {makeFirstSymbolUpper(doctor.last_name)}{" "}
                  {makeFirstSymbolUpper(doctor.first_name)}{" "}
                  {makeFirstSymbolUpper(doctor.middle_name)}
                </option>
              ))}
            </SelectField>

            <SelectField
              form={form}
              name={"service"}
              placeholder={"Оберіть послугу"}
              className="ml-15 max-w-90 w-full"
              loading={serviceLoading}
              disabled={!services || services.length === 0}
            >
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </SelectField>
          </div>

          <h1
            className={`${inter_bold.className} mt-5 mb-2.5 ml-1 text-xl text-[#6E6E6E]`}
          >
            Дата/Час
          </h1>

          <div className="flex">
            <SelectField
              form={form}
              name="date"
              placeholder="Оберіть дату"
              className="max-w-115.75 w-full"
              loading={datesLoading}
              disabled={!dates || dates.length === 0 || timesLoading}
              listeners={{ onChange: (event) => onTimeSelect(event.value) }}
            >
              {dates?.map((date) => (
                <option value={date}>{date}</option>
              ))}
            </SelectField>

            <SelectField
              form={form}
              name="time"
              placeholder="Оберіть час"
              className="max-w-115.75 w-full ml-14.75"
              loading={timesLoading}
              disabled={!times || times.length === 0 || datesLoading}
            >
              {times?.map((time) => (
                <option value={time}>{time}</option>
              ))}
            </SelectField>
          </div>

          <h1
            className={`${inter_bold.className} mt-5 mb-2.5 ml-1 text-xl text-[#6E6E6E]`}
          >
            Пацієнт
          </h1>

          <form.Field
            name="patient_type"
            children={(field) => (
              <div
                className={`${inter_bold.className} text-[16px] text-[#6E6E6E]`}
              >
                <div className="flex">
                  <input
                    id="self"
                    type="radio"
                    name="patinet_type"
                    value={"SELF"}
                    defaultChecked
                    className="appearance-none rounded-full border-2 border-white outline-2 outline-[#8AA382] h-max p-1.75 checked:bg-[#8AA382] transition-colors duration-300 ease-out"
                    onChange={(e) =>
                      field.handleChange(e.target.value as PatientType.Child)
                    }
                  />
                  <p className="ml-2.5">
                    Для себе:{" "}
                    <span className="text-[#888888]">
                      {user.last_name} {user.first_name} {user.middle_name}
                      {user.phone && ` (${user.phone})`}
                    </span>
                  </p>
                </div>

                <div className="flex mt-2.5">
                  <input
                    id="child"
                    type="radio"
                    name="patinet_type"
                    value={"CHILD"}
                    className="appearance-none rounded-full border-2 border-white outline-2 outline-[#8AA382] h-max p-1.75 checked:bg-[#8AA382] transition-colors duration-300 ease-out"
                    onChange={(e) =>
                      field.handleChange(e.target.value as PatientType.Child)
                    }
                  />
                  <p className="ml-2.5">Для дитини / іншої особи</p>
                </div>
              </div>
            )}
          />

          <h1
            className={`${inter_bold.className} mt-12 mb-2.5 ml-1 text-xl text-[#6E6E6E]`}
          >
            Примітка до візиту (необов'язково)
          </h1>

          <div className="flex justify-between">
            <form.Field
              name="description"
              children={(field) => {
                return (
                  <div className="w-full max-w-136.25 relative">
                    <textarea
                      className="bg-[#F0F0F0] w-full resize-none p-2.5 max-w-136.25 h-36.75 outline-none appearance-none"
                      style={
                        field.state.meta.errors.length > 0
                          ? { borderColor: "#C94C4E", borderWidth: "2px" }
                          : { border: "none" }
                      }
                      rows={2}
                      cols={2}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={() => field.handleBlur()}
                    />

                    <p
                      className={`${open_sans.className} text-black transition-all duration-1000 ease-in-out text-[14px] absolute bottom-3 right-2 bg-white border-[#C94C4E] border-2 py-1.5 px-5 rounded-xl`}
                      style={{
                        visibility:
                          field.state.meta.errors.length > 0
                            ? "visible"
                            : "hidden",
                        opacity:
                          field.state.meta.errors.length > 0 ? "100%" : "0%",
                      }}
                    ></p>
                  </div>
                );
              }}
            />

            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit) => (
                <button
                  className={`${inter_bold.className} text-white mt-auto h-max bg-[#8AA382] py-2.5 px-16 rounded-[9px] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
                  onClick={() => form.handleSubmit()}
                  disabled={!canSubmit}
                >
                  Записатись
                </button>
              )}
            ></form.Subscribe>
          </div>
        </>
      )}
    </div>
  );
}
