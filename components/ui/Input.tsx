import { Open_Sans } from "next/font/google";
import Image from "next/image";
import {
  DetailedHTMLProps,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import clearIcon from "@/assets/clear-icon.svg";
import { concat } from "@/helpers/concat";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

export interface InputProps<T extends HTMLInputTypeAttribute> {
  id?: string;
  name?: string;
  icon?: string;
  errorMessage?: string;
  placeholder: string;
  value?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["value"];
  onBlur?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["onBlur"];
  onChange?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["onChange"];
  onClearClick?: () => void;
  type: T;
  showPassword?: T extends "password" ? boolean : never;
  className?: string;
  additionalButton?: AdditionalButton;
  ref?: Ref<HTMLDivElement>;
  disabled?: boolean;
}

interface AdditionalButton {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Input<T extends HTMLInputTypeAttribute>({
  id,
  name,
  icon,
  placeholder,
  errorMessage,
  type,
  className,
  showPassword,
  additionalButton,
  value,
  onBlur,
  onClearClick,
  onChange,
  ref,
  disabled,
}: InputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cValue, setCValue] = useState<string | undefined>(
    typeof value === "string" ? value : "",
  );

  useEffect(() => {
    setCValue(typeof value === "string" ? value : "");
  }, [value]);

  console.log(value);

  return (
    <div className={concat(className, "relative")}>
      <div
        ref={ref}
        className={concat(
          `${open_sans.className} text-[16px] text-[#6E6E6E] bg-white items-center rounded-[10px] border-2 flex relative transition-all duration-300 ease-in-out`,
          additionalButton === undefined
            ? "py-3.75 px-10.75"
            : "py-2.5 pr-2.25 pl-10.75",
          disabled ? "opacity-65 cursor-not-allowed" : "",
        )}
        style={
          errorMessage ? { borderColor: "#C94C4E" } : { borderColor: "#8AA382" }
        }
      >
        {icon && <Image src={icon} alt="icon" />}
        <p
          style={{
            visibility:
              !cValue || (typeof cValue === "string" && cValue.length === 0)
                ? "visible"
                : "hidden",
            opacity:
              !cValue || (typeof cValue === "string" && cValue.length === 0)
                ? "75%"
                : "0%",
            left: icon ? "91px" : "43px",
          }}
          className="absolute left-22.75 transition-all duration-300 ease-in-out pointer-events-none"
        >
          {placeholder}
        </p>
        <input
          ref={inputRef}
          className="w-full outline-0 disabled:cursor-not-allowed"
          style={{ marginLeft: icon ? "25px" : "0px" }}
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          onBlur={onBlur}
          onChange={(e) => {
            setCValue(e.target.value);
            onChange?.(e);
          }}
        />
        <Image
          className={concat(disabled ? "cursor-not-allowed" : "cursor-pointer")}
          src={clearIcon}
          alt="clear_icon"
          onClick={
            onClearClick ??
            (() => {
              setCValue("");
              if (disabled || !inputRef.current) return;
              inputRef.current.value = "";
            })
          }
        />
        {additionalButton !== undefined && (
          <button
            onClick={() => additionalButton.onClick()}
            disabled={additionalButton.disabled}
            className="whitespace-nowrap w-max cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed bg-[#8AA382] text-white ml-6.25 px-7 py-2.25 rounded-[9px]"
          >
            {additionalButton.text}
          </button>
        )}
      </div>
      {errorMessage && (
        <p
          className={`absolute z-10 left-2 top-15.5 text-[#C94C4E] ${open_sans.className} text-[14px]`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
