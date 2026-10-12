import { ReactFormExtendedApi, useSelector } from "@tanstack/react-form";
import { Inter, Open_Sans } from "next/font/google";
import Image from "next/image";
import { ReactNode } from "react";
import { concat } from "@/helpers/concat";
import threeLinesIcon from "@/assets/three-lines.svg";
import Loading from "./Loading";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

const inter_bold = Inter({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

export interface SelectFieldProps<
  Form extends ReactFormExtendedApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
> {
  form: Form;
  name: Parameters<Form["Field"]>[0]["name"];
  placeholder: string;
  className?: string;
  children?: ReactNode[];
  disabled?: boolean;
  listeners?: Parameters<Form["Field"]>[0]["listeners"];
  loading?: boolean;
}

export default function SelectField<
  Form extends ReactFormExtendedApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
>({
  form,
  name,
  placeholder,
  className,
  children,
  disabled,
  listeners,
  loading,
}: SelectFieldProps<Form>) {
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <form.Field
      listeners={listeners}
      name={name}
      children={(field) => {
        return (
          <>
            <div
              className={concat(
                className,
                "relative",
                !loading && disabled ? "opacity-60" : "",
              )}
            >
              <Image
                className="absolute right-10.75 top-1/2 -translate-y-1/2 pointer-events-none"
                src={threeLinesIcon}
                alt="icon-three-lines"
              />
              {loading ? (
                <div
                  className={concat(
                    undefined,
                    `py-6 px-10.75 border-2 rounded-xl ${inter_bold.className} text-[#6E6E6E] appearance-none disabled:cursor-not-allowed`,
                    "w-full",
                  )}
                  style={
                    field.state.meta.errors.length > 0
                      ? { borderColor: "#C94C4E" }
                      : { borderColor: "#8AA382" }
                  }
                >
                  <Loading />
                </div>
              ) : (
                <select
                  className={concat(
                    undefined,
                    `py-5.5 px-10.75 border-2 rounded-xl ${inter_bold.className} text-[#6E6E6E] appearance-none disabled:cursor-not-allowed`,
                    "w-full",
                  )}
                  style={
                    field.state.meta.errors.length > 0
                      ? { borderColor: "#C94C4E" }
                      : { borderColor: "#8AA382" }
                  }
                  name={name}
                  id={name}
                  disabled={isSubmitting || disabled || loading}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => field.handleBlur()}
                >
                  <option value={-1}>{placeholder}</option>
                  {children && <>{...children}</>}
                </select>
              )}
            </div>
          </>
        );
      }}
    />
  );
}
