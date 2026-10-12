import {
  FieldComponent,
  ReactFormExtendedApi,
  useForm,
  useSelector,
} from "@tanstack/react-form";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import { HTMLInputTypeAttribute, Ref } from "react";
import clearIcon from "@/assets/clear-icon.svg";
import { concat } from "@/helpers/concat";
import Input from "./Input";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

export interface TextFieldProps<
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
  T extends HTMLInputTypeAttribute = any,
> {
  form: Form;
  name: Parameters<Form["Field"]>[0]["name"];
  icon?: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  showPassword?: T extends "password" ? boolean : never;
  className?: string;
  additionalButton?: AdditionalButton;
  listeners?: Parameters<Form["Field"]>[0]["listeners"];
  ref?: Ref<HTMLDivElement>;
  disabled?: boolean;
}

interface AdditionalButton {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function TextField<
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
  icon,
  placeholder,
  type,
  className,
  showPassword,
  additionalButton,
  listeners,
  ref,
  disabled,
}: TextFieldProps<Form>) {
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <form.Field
      listeners={listeners}
      name={name}
      children={(field) => (
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          showPassword={showPassword}
          type={type}
          additionalButton={additionalButton}
          ref={ref}
          disabled={disabled || isSubmitting}
          className={className}
          icon={icon}
          onBlur={() => field.handleBlur()}
          onChange={(e) => field.handleChange(e.target.value)}
          onClearClick={() => field.setValue("")}
          errorMessage={
            field.state.meta.errors.length > 0
              ? (field.state.meta.errors[0]?.message ?? "Некоректне введення")
              : undefined
          }
        />
      )}
    />
  );
}
