import { emailChangeConfirm } from "@/api/verification/email-change/confirm";
import { emailChangeRequest } from "@/api/verification/email-change/request";
import Loading from "@/components/ui/Loading";
import TextField from "@/components/ui/TextField";
import { humanError } from "@/helpers/humanError";
import { useForm, useSelector } from "@tanstack/react-form";
import { Inter } from "next/font/google";
import { useRef, useState } from "react";
import z, { email } from "zod";

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

interface EmailSettingsForm {
  email: string;
  code: string;
}

export default function EmailSettingsForm() {
  const codeFieldRef = useRef<HTMLDivElement>(null);

  const [canSend, setCanSend] = useState<boolean>(false);
  const [codeSended, setCodeSended] = useState<boolean>(false);

  const [sending, setSending] = useState<boolean>(false);

  const [sendError, setSendError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const emailValidator = z
    .email("Вкажіть дійсну адресу електронної пошти")
    .regex(/^(\w|.)+@gmail\.com$/, "Дозволено лише скриньки gmail.com");

  const form = useForm({
    defaultValues: {
      email: "",
      code: "",
    } as EmailSettingsForm,
    validators: {
      onChange: z.object({
        email: emailValidator,
        code: z
          .string("Введіть код")
          .min(6, "Код має складатися із шести цифр")
          .max(6, "Код має складатися із шести цифр")
          .refine(
            (v) => !isNaN(parseInt(v)),
            "Код має складатися із шести цифр",
          ),
      }),
    },
    onSubmit: async ({ value }) => {
      setLoading(true);

      await new Promise<void>((resolve) => {
        emailChangeConfirm(value.code)
          .then(() => {
            setMessage("Ви успішно змінили пошту");
            form.reset();
            setCodeSended(false);
            setLoading(false);
            resolve();
          })
          .catch((e) => {
            const error = humanError(e);
            setSendError(error);
            form.reset();
            setCodeSended(false);
            setLoading(false);
            resolve();
          });
      });
    },
  });

  const email = useSelector(form.store, (state) => state.values.email);

  const sendCode = () => {
    setSendError(null);
    setSending(true);

    emailChangeRequest(email)
      .then(() => {
        setCodeSended(true);
        setSending(false);
      })
      .catch((e) => {
        const error = humanError(e);
        setSendError(error);
        setSending(false);
      });
  };

  return (
    <div className="flex flex-col relative">
      {loading && (
        <div className="absolute backdrop-blur-sm w-[110%] translate-x-[-5%] translate-y-[-2.5%] h-[110%] z-50 flex flex-col justify-center items-center">
          {loading && <Loading />}
        </div>
      )}

      <p
        className={`mt-10.75 mb-2 ${inter_bold.className} text-[16px] text-[#8AA382] text-center`}
        style={{ opacity: message !== null ? "100%" : "0%" }}
      >
        {message}
      </p>

      <h1 className={`${inter_bold.className} text-xl text-[#6E6E6E] mb-1.5`}>
        Змінити електронну пошту
      </h1>

      <TextField
        form={form}
        name="email"
        type="text"
        placeholder="Введіть нову електронну пошту"
        disabled={sending || codeSended}
        listeners={{
          onChange: ({ value }) => {
            try {
              emailValidator.parse(value);
            } catch (e) {
              setCanSend(false);
              return;
            }

            setCanSend(true);
          },
        }}
        additionalButton={{
          text: codeSended ? "Код відправлено" : "Запросити код",
          onClick: () => sendCode(),
          disabled: !canSend || sending,
        }}
      />

      <div className="flex items-center mt-10.5">
        <TextField
          form={form}
          disabled={!codeSended || sending}
          name="code"
          type="text"
          placeholder="Введіть тимчасовий код"
          className="max-w-117.25 w-full"
          ref={codeFieldRef}
          listeners={{
            onChange: ({ fieldApi, value }) => {
              if (value.length <= 6) return;

              if (codeFieldRef.current) {
                codeFieldRef.current.style.scale = "1.5";
                setTimeout(
                  () =>
                    codeFieldRef.current?.style.scale
                      ? (codeFieldRef.current.style.scale = "1")
                      : null,
                  40,
                );
              }

              fieldApi.setValue(value.slice(0, 6));
            },
          }}
        />

        {sending && <Loading className="ml-10" />}
        {sendError && (
          <p
            className={`ml-10 ${inter_bold.className} text-[16px] text-[#C94C4E]`}
          >
            {sendError}
          </p>
        )}
      </div>

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
