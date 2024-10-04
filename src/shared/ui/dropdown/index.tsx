import { ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label, Combobox as LibraryCombobox, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDown, X } from 'lucide-react'

import cn from 'classnames'

interface ComboBoxProps<T> {
  items: T[],
  selected: T | null,
  onChange: (item: T) => void,
  onClear?: () => void,
  getKey?: (item: T) => Id,
  getTitle?: (item: T) => string,
  query: string,
  onSearch: (value: string) => void,
  pending?: boolean,
  title?: string,
  className?: string,
  disabled?: boolean,
  placeholder?: string,
  withHide?: boolean,
  notFound?: boolean,
  isError?: boolean
  onCustomAdd?: (value: string) => void
}


export const ComboBox = <T,>({ disabled, items, isError, selected, onSearch, onChange, onClear, notFound, getKey = (item: any) => item.id, getTitle = (item: any) => item.name, query, pending, title, className, placeholder, withHide }: ComboBoxProps<T>) => {
  return (
    <Field className={cn("w-full flex flex-col *:flex-1 gap-4 relative", className)} >
      {title && <Label className="f-b5 select-none text-gray-2" > {title} </Label>}
      <LibraryCombobox value={selected} onChange={(e) => onChange && e && onChange(e)}>
        <ComboboxButton className="w-full relative" >
          <ComboboxInput onChange={(event) => onSearch(event.target.value)} displayValue={() => selected ? getTitle(selected) : ""} disabled={disabled} placeholder={placeholder}
            className={cn("w-full border rounded-8 border-gray-3 bg-white py-8 pl-12 pr-32 f-b3 transition-all duration-200 disabled:!bg-gray-4 disabled:cursor-no-drop data-[open]:rounded-b-0", isError && "border-red-1 error")} />
          {pending ? <span className=' absolute right-8 top-[calc(50%-8px)] border-2 border-gray-2 rounded-full border-b-transparent size-16 animate-spin' /> :
            (selected && getTitle(selected) !== "" && onClear) && <X size={16} className='absolute right-8 top-[calc(50%-8px)] ' onClick={() => onClear && onClear()} />}
        </ComboboxButton>
        < ComboboxOptions transition anchor="bottom" className={cn("w-[var(--input-width)] border border-t-0 border-gray-3  !pt-0   bg-white rounded-b-8 transition duration-200  data-[closed]:opacity-0 shadow-l !max-h-200 overflow-y-auto !min-h-30 flex flex-col z-20")} >
          {
            !pending && (!withHide || query.length >= 3) && items.length !== 0 ?
              items.map(e => (
                <ComboboxOption key={getKey(e)} value={e} className="border-b border-gray-3 data-[focus]:bg-gray-4  last:border-b-0 p-4 px-12 f-b3 cursor-pointer transition-colors duration-75 " >
                  {getTitle(e)}
                </ComboboxOption>
              )) :
              pending ?
                <span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > Ищем...</span> :
                withHide && (query.length < 3 || !pending && !notFound) ?
                  <span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > Начните вводить запрос...</span> :
                  < span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > По вашему запросу ничего не найдено </span>
          }
        </ComboboxOptions>
      </LibraryCombobox>
    </Field>
  )
}

interface MultipleComboBoxProps<T> {
  items: T[],
  selected: T[],
  onChange: (item: T[]) => void,
  getKey?: (item: T) => string | number,
  getTitle?: (item: T) => string,
  query: string,
  onSearch: (value: string) => void,
  pending?: boolean,
  title?: string,
  className?: string,
  disabled?: boolean,
  placeholder?: string,
  withHide?: boolean,
  notFound?: boolean,
  isError?: boolean
  onCustomAdd?: (value: string) => void
}

//FIXME: Придумать более внятный способ рендерить подсказки

export const MultipleComboBox = <T,>({ items, selected, onSearch, onChange, getKey = (item: any) => item.id, getTitle = (item: any) => item.name, query, pending, title, className, disabled, placeholder, withHide, notFound, isError, onCustomAdd }: MultipleComboBoxProps<T>) => {
  let list = items.filter(e => !selected.map(el => getKey(el)).includes(getKey(e)))
  const removeHandler = (item: T) => {
    if (!!onChange) {
      let result = selected.slice();
      let index = result.findIndex(e => getKey(e) === getKey(item))
      if (index >= 0)
        result.splice(index, 1)
      onChange([...result])
    }
  }
  return (
    <Field className={cn("w-full flex flex-col gap-4 relative", className)}>
      {title && <Label className="f-b5 select-none text-gray-2">{title}</Label>}
      {selected.length !== 0 &&
        <div className='flex flex-wrap w-full gap-8 mb-4'>
          {selected.map(e =>
            <button className='px-6 py-2 bg-gray-3 rounded-8 flex gap-4 items-center f-b5' key={getKey(e)} onClick={() => removeHandler(e)}>
              {getTitle(e)}
              <X size={14} strokeWidth={1.25} />
            </button>)}
        </div>}
      <LibraryCombobox value={selected} multiple onClose={() => onSearch('')} onChange={(e) => { onChange && onChange(e); onSearch('') }}>
        <ComboboxButton className="w-full relative" >
          <ComboboxInput onChange={(event) => onSearch(event.target.value)} disabled={disabled} placeholder={placeholder} value={query}
            className={cn("w-full border rounded-8 border-gray-3 bg-white py-8 pl-12 pr-32 f-b3 transition-all duration-200 disabled:!bg-gray-4 disabled:cursor-no-drop data-[open]:rounded-b-0", isError && "border-red-1 error")} />
          {pending && <span className=' absolute right-8 top-[calc(50%-8px)] border-2 border-gray-2 rounded-full border-b-transparent size-16 animate-spin' />}
        </ComboboxButton>
        < ComboboxOptions transition anchor="bottom" className={cn("w-[var(--input-width)] border border-t-0 border-gray-3  !pt-0   bg-white rounded-b-8 transition duration-200  data-[closed]:opacity-0 shadow-l !max-h-200 overflow-y-auto !min-h-30 flex flex-col z-20")} >
          {
            !pending && (!withHide || query.length >= 3) && list.length !== 0 ?
              list.map(e => (
                <ComboboxOption key={getKey(e)} value={e} className="border-b border-gray-3 data-[focus]:bg-gray-4  last:border-b-0 p-4 px-12 f-b3 cursor-pointer transition-colors duration-75 ">
                  {getTitle(e)}
                </ComboboxOption>
              )) :
              pending ?
                <span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > Ищем...</span> :
                withHide && (query.length < 3 || !pending && !notFound) ?
                  <span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > Начните вводить запрос...</span> :
                  < span className=' p-4 pt-8 px-12 f-b3  !box-border h-40 select-none' > По вашему запросу ничего не найдено </span>
          }
        </ComboboxOptions>
      </LibraryCombobox>
    </Field>
  )
}

interface DropdownProps<T> {
  items: T[],
  selected: T | null,
  onChange: (item: T) => void,
  getKey?: (item: T) => string | number,
  getTitle?: (item: T) => string,
  pending?: boolean,
  title?: string,
  className?: string,
  disabled?: boolean,
  placeholder?: string
}

export const Dropdown = <T,>({ disabled, items, selected, onChange, getKey = (item: any) => item.id, getTitle = (item: any) => item.name, pending, title, className, placeholder }: DropdownProps<T>) => {
  return (
    <Field className={cn("w-full flex flex-col *:flex-1 gap-4 relative", className)}>
      {title && <Label className="f-b5 select-none text-gray-2 max-h-[18px]">{title}</Label>}
      <Listbox >
        <ListboxButton className=" w-full border rounded-8 border-gray-3 bg-white py-8 pl-12 pr-32 f-b3 transition-all duration-200 disabled:!bg-gray-4 disabled:cursor-no-drop data-[open]:rounded-b-0  caret-transparent cursor-pointer select-none relative group flex" disabled={disabled}>
          {selected ?
            <span className='text-start flex-1 '>{selected && getTitle(selected)}</span> :
            <span className='text-start flex-1 text-gray-2'>{placeholder} &ensp;</span>}
          {pending ? <span className='absolute right-8 top-[calc(50%-8px)] border-2 border-gray-2 rounded-full border-b-transparent size-16 animate-spin ' /> :
            <ChevronDown size={16} className='absolute right-8 top-[calc(50%-8px)] group-data-[open]:-rotate-180 transition-transform duration-200' />}
        </ListboxButton>
        <ListboxOptions transition anchor="bottom" className={cn("w-[var(--button-width)] border border-t-0 border-gray-3  !pt-0   bg-white rounded-b-8 transition duration-200  data-[closed]:opacity-0 shadow-l !max-h-200 overflow-y-auto !min-h-30", pending && "invisible")}>
          {items.length !== 0 ?
            items.map(e => (
              <ListboxOption key={getKey(e)} value={getTitle(e)} className="border-b border-gray-3 data-[focus]:bg-gray-4  last:border-b-0 p-4 px-12 f-b3 cursor-pointer transition-colors duration-75 " onClick={_ => onChange && onChange(e)}>
                {getTitle(e)}
              </ListboxOption >
            )) :
            <span className=' p-4 pt-8 px-12 f-b3'>По вашему запросу ничего не найдено</span>
          }
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}