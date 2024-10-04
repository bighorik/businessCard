import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

import cn from "classnames";
import { FileDrop } from "react-file-drop";
import doc from "./assets/doc.svg";
import docx from "./assets/docx.svg";
import dropFileIcon from "./assets/dropFile.svg";
import file from "./assets/file.svg";
import jpeg from "./assets/jpeg.svg";
import jpg from "./assets/jpg.svg";
import png from "./assets/png.svg";
import xlsx from './assets/xls.svg';

const iconsFile = {
  png: png,
  jpg: jpg,
  jpeg: jpeg,
  doc: doc,
  docx: docx,
  xlsx: xlsx,
  xls: xlsx
}

interface FileDndProps {
  handleFile: (event: FileList | null) => void;
  availableTypes: ("png" | "jpg" | "jpeg" | "mp4" | "doc" | "docx" | "pdf" | "xlsx" | "*")[];
  isError?: boolean
}

export const iconSelect = (name: string): string => {

  let result = file
  let ext = name.split('.').pop();
  Object.entries(iconsFile).forEach(e => {
    if (e[0] === ext) result = e[1]
  })

  return result
}



export const FileDnd = ({ handleFile, availableTypes, isError }: FileDndProps) => {
  let types = availableTypes as string[];
  const [dragEnterCount, setDragEnterCount] = useState(0);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <FileDrop
      className=" h-max *:h-max group"
      onDrop={(e) => {
        setDragEnterCount(0);
        handleFile(e);
      }}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center border-2 border-dashed border-gray-3 rounded-8 p-24",
          "relative transition-colors duration-300 cursor-pointer h-full gap-y-8 hover:bg-gray-4 hover:border-gray-1",
          "min-w-[240px]", dragEnterCount > 0 && "bg-gray-3 border-gray-1", isError && "border-red-1"
        )}
        onDragEnter={() => setDragEnterCount((prev) => prev + 1)}
        onDragLeave={() => setDragEnterCount((prev) => prev - 1)}
        onClick={() => ref.current?.click()}
      >
        <img src={dropFileIcon} alt="" />
        <span className="f-b4">Перетащите или выберете файл</span>
        <span className="tet-gray-2 f-b4 md:mb-8">
          Поддерживаемые форматы:{" "}
          {types.reduce((res, e) => (res += ", " + e)).toUpperCase()}
        </span>
        <input
          accept={availableTypes.reduce((res, e) => (res += e + ",."), ".")}
          type="file"
          multiple
          ref={ref}
          onChange={(e) => handleFile(e.target.files)}
          className="opacity-0 absolute top-[-10000px] right-[-10000px] z-[-1111] h-0 w-0"
        />
        <button className="rounded-8 bg-white font-bold border !border-gray-3 py-9 px-32 ">
          Выбрать файл
        </button>
        <span className="static mt-6 bottom-32 right-32 f-b5 color-gray-2 group-only:absolute group-only:mt-0 lg:mt-16 group-only:lg:static">
          Максимальный объем файла 50МБ
        </span>
      </div>
    </FileDrop>
  );
};

interface PhotoDndProps<T> {
  handleFile: (event: FileList | null) => void;
  isError?: boolean,
  photos: T[],
  getKey: (item: T) => string,
  getUrl: (item: T) => string,
  onRemove?: (item: T) => void,
  onSelect?: (item: T) => void,
  selected?: T
}

export const PhotoDnd = <T,>({ handleFile, isError, photos, getKey, getUrl, onRemove, onSelect, selected }: PhotoDndProps<T>) => {
  const [dragEnterCount, setDragEnterCount] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(110px,160px))] gap-12 ">
      {photos.map(e => {
        let isSelected = selected && getKey(e) === getKey(selected);
        return (
          <div className={cn("flex justify-center items-center bg-bg rounded-8  max-h-[195px]  relative overflow-clip group border-2 border-white transition-colors *:delay-75", isSelected && '!border-accent')}>
            <img className="object-fill  max-h-full w-full" src={getUrl(e)} />
            <button className={cn('absolute bottom-0 left-0 w-full bg-[rgba(134,134,134,0.4)] translate-y-full group-hover:translate-y-0 transition flex py-4 px-8    cursor-pointer text-white f-b5 justify-center', isSelected && '!cursor-default')} onClick={() => onSelect && onSelect(e)}>{isSelected ? 'Выбрана основной' : 'Сделать основной'}</button>
            <button className='absolute top-0 right-0 p-4 rounded-bl-8 -translate-y-full group-hover:translate-y-0 transition flex cursor-pointer *:stroke-white f-b5 bg-[rgba(134,134,134,0.4)]' onClick={() => onRemove && onRemove(e)}><X /></button>
          </div>
        )
      })}
      <FileDrop
        className="*:h-full group  max-h-[195px] "
        onDrop={(e) => {
          setDragEnterCount(0);
          handleFile(e);
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center border-2 border-dashed border-gray-3 rounded-8 p-24 ",
            "relative transition-colors duration-300 cursor-pointer h-full gap-y-8 hover:bg-gray-4 hover:border-gray-1",
            "min-w-[130px]", dragEnterCount > 0 && "bg-gray-3 border-gray-1", isError && "border-red-1"
          )}
          onDragEnter={() => setDragEnterCount((prev) => prev + 1)}
          onDragLeave={() => setDragEnterCount((prev) => prev - 1)}
          onClick={() => ref.current?.click()}
        >
          <div className="size-52 rounded-full bg-bg p-[10px]">
            <ImagePlus size={32} />
          </div>
          <span className="f-b4 text-center">Перетащите или выберете фотографии</span>
          <input
            accept={'.png,.webp,.jpg,.jpeg'}
            type="file"
            multiple
            ref={ref}
            onChange={(e) => handleFile(e.target.files)}
            className="opacity-0 absolute top-[-10000px] right-[-10000px] z-[-1111] h-0 w-0"
          />
          {photos.length === 0 &&
            <button className="rounded-8 bg-white font-bold border !border-gray-3 py-9 px-32 ">
              Выбрать файл
            </button>
          }
        </div>
      </FileDrop>
    </div>
  );
};
