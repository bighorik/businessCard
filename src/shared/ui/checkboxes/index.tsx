import { Field, Label, Checkbox as LibraryCheckbox, Radio, RadioGroup as Radios } from '@headlessui/react';

import cn from 'classnames';
import { Check } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface ImageCheckboxProps {
  checked?: boolean,
  onClick?: () => void,
}

export const ImageCheckbox = ({ checked, onClick, children }: PropsWithChildren<ImageCheckboxProps>) => {

  return (
    <LibraryCheckbox checked={checked} onChange={onClick} className={cn("cursor-pointer *:stroke-gray-2 hover:*:stroke-gray-3 *:transition *:duration-75 p-4 border border-gray-3 rounded-4", checked && "*:!stroke-accent bg-gray-4")}>
      {children}
    </LibraryCheckbox>
  )
};

interface RadioProps<T> {
  items: T[],
  selected: T,
  onClick: (value: T) => void,
  getTitle: (value: T) => string,
  variant?: "row" | "list",
  title?: string,
  className?: string
}

export const RadioGroup = <T,>({ items, selected, onClick, variant, title, className, getTitle }: RadioProps<T>) => {

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && <label className="f-b5 select-none text-gray-2">{title}</label>}
      <Radios value={selected} onChange={onClick} className={cn("flex gap-12 flex-wrap items-start", variant === "list" && "flex-col !gap-6")}>
        {items.map((e, i) => (
          <Field key={getTitle(e)} className="flex gap-6 items-center select-none">
            <Radio value={e} className={"size-20 rounded-full flex items-center justify-center cursor-pointer  transition-colors   border border-gray-3 data-[checked]:bg-accent hover:bg-green-3"} >
              <Check color="white" size={12} strokeWidth='5px' />
            </Radio>
            <Label>{getTitle(e)}</Label>
          </Field>
        ))}

      </Radios>
    </div>
  )
};

interface CheckboxProps {
  title?: string,
  checked?: boolean,
  onClick?: () => void,
  className?: string
}

export const Checkbox = ({ onClick, checked, title, className }: CheckboxProps) => {

  return (
    <Field className={cn("flex gap-6 items-center select-none", className)}>
      <LibraryCheckbox checked={checked} onChange={onClick} className={"size-20 flex items-center justify-center cursor-pointer  transition-colors   border border-gray-3 rounded-4 data-[checked]:bg-accent hover:bg-green-3"}>
        <Check color="white" size={14} strokeWidth='5px' />
      </LibraryCheckbox>
      <Label>{title}</Label>
    </Field>

  )
};

interface CheckboxGroupProps<T> {
  items: T[],
  onClick: (index: number) => void,
  getTitle: (item: T) => string,
  getChecked: (item: T) => boolean,
  title?: string,
  className?: string,
  wrapperClassName?: string
  isLoading?: boolean
}

export const CheckboxGroup = <T,>({ onClick, items, title, className, getTitle, wrapperClassName, getChecked, isLoading }: CheckboxGroupProps<T>) => {

  return (
    <div className={cn("flex flex-col gap-4 w-full", wrapperClassName)}>
      {title && <label className="f-b5 select-none text-gray-2">{title}</label>}
      <div className={cn("grid grid-cols-2 justify-between gap-4", className)}>
        {items.map((e, i) =>
          <Checkbox title={getTitle(e)} onClick={() => onClick(i)} checked={getChecked(e)} />
        )}
      </div>
    </div>
  )
};


interface SwitchProps {
  onClick?: () => void;
  checked?: boolean;
  title?: string,
  className?: string
}

interface GeneralCaseSwitchProps extends SwitchProps {
  firstTitle?: string,
  secondTitle?: string
}

export const Switch = ({ onClick, checked, className, firstTitle, secondTitle, title }: GeneralCaseSwitchProps) => {

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && <label className="f-b5 select-none text-gray-2">{title}</label>}
      <div className='border border-gray-3  overflow-hidden w-max flex  relative rounded-[40px] cursor-pointer select-none' onClick={onClick && onClick}>
        <span className={cn("w-half  z-10 h-32 flex items-center justify-center f-b3 p-8 pl-20 pr-16 transition-colors text-nowrap", !checked && "text-white")}>{firstTitle}</span>
        <span className={cn("w-half  z-10 h-32 flex items-center justify-center f-b3 p-8 pr-20 pl-16 transition-colors text-nowrap", checked && "text-white")}>{secondTitle}</span>
        <div id="gender-slide" className={cn('h-40 w-half  bg-accent transition-transform duration-200 absolute', checked && ' translate-x-[calc(100%+1px)]')}></div>
      </div>
    </div>

  )
};

