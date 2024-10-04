import { Field, Input as HeadlessInput, Label, Textarea as LibraryTextarea } from '@headlessui/react';
import { Eye, EyeOff } from 'lucide-react';
import React, { useId, useState } from "react";

import cn from 'classnames';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  title?: string,
  isError?: boolean,
  errorText?: string,
  wrapperClassName?: string,
  type?: "phone" | "number" | "money" | "string" | "password" | "search" | "date",
  maxCount?: number,
  prevImgHref?: string
}

export const Input = ({ title, isError, errorText, wrapperClassName, type, maxCount, prevImgHref, ...props }: InputProps) => {
  const [passShown, setPassShown] = useState(false);
  const id = useId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      if (maxCount && e.target.value.length > maxCount) {
        e.preventDefault();
        return;
      }

      switch (type) {
        case "number":
          {
            let value = e.target.value;
            value = value
              .replace(/[^.\d]+/g, "")
              .replace(/^([^\.]*\.)|\./g, "$1");
            e.target.value = value;
            props.onChange && props.onChange(e);
          }
          break;
        case "phone":
          {
            let value = e.target.value;
            if (value === "8") {
              value = "+7"
              e.target.value = value
              props.onChange && props.onChange(e)
            }
            else if (value.length === 1 && !isNaN(Number(value))) {
              value = "+7" + value
              e.target.value = value
              props.onChange && props.onChange(e)
            }
            value = value
              .replace(/[^0-9+]/, "")
              .replace(/^([^\.]*\.)|\./g, "$1");
            value = value.substring(0, 12);
            e.target.value = value;
            props.onChange && props.onChange(e);
          }
          break;
        default:
          props.onChange && props.onChange(e);
      }
    }
  };


  return (
    <Field className={cn("w-full flex flex-col *:flex-1 gap-4 relative", wrapperClassName)}>
      {title && <Label className="f-b5 select-none text-gray-2">{title}</Label>}
      <HeadlessInput
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        type={type === "password" && !passShown ? "password" : type === "date" ? type : "input"}
        id={id}
        name={props.name}
        disabled={props.disabled}
        max={props.max}
        min={props.min}
        className={cn(
          "border rounded-8 border-gray-3 bg-white py-8 px-12 f-b3 transition-all duration-300 disabled:!bg-gray-4 disabled:cursor-no-drop",
          prevImgHref && "pl-48",
          type === "password" && "pr-32",
          (isError || errorText) && "border-red", props.className)} />
      {type === "password" && (
        <button onClick={() => setPassShown((prev) => !prev)} className='absolute right-12 top-[30px] md:top-28 z-10'>
          {passShown ? <EyeOff color='rgb(149, 149, 151)' /> : <Eye color='rgb(149, 149, 151)' />}
        </button>
      )}
      {prevImgHref && <img src={prevImgHref} className='size-20 absolute top-32 md:top-[30px] left-12' />}
      {errorText && <span className="f-b5 text-red">{errorText}</span>}
    </Field>
  )
};

interface TextareaProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  title?: string,
  isError?: boolean,
  errorText?: string,
  wrapperClassName?: string,
}

export const Textarea = ({ title, isError, errorText, wrapperClassName, ...props }: TextareaProps) => {
  return (
    <Field className={cn("w-full flex flex-col *:flex-1 gap-4 relative", wrapperClassName)}>
      {title && <Label className="f-b5 select-none text-gray-2">{title}</Label>}
      <LibraryTextarea
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        name={props.name}
        disabled={props.disabled}

        className={cn(
          "border rounded-8 border-gray-3 bg-white py-8 px-12 f-b3 transition-all duration-300 disabled:!bg-gray-4 disabled:cursor-no-drop resize-none min-h-[100px]",
          (isError || errorText) && "border-red", props.className)} />
      {errorText && <span className="f-b5 text-red">{errorText}</span>}
    </Field>
  )
};
