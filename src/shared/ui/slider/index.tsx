import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import cn from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';

interface FullScreenPhotoSliderProps<T> {
  isOpen?: boolean,
  onClose?: () => void,
  photos: T[];
  getUrl: (item: T) => string,
  startIndex?: number,
}
export const FullScreenPhotoSlider = <T,>({ photos, getUrl, startIndex, isOpen, onClose }: FullScreenPhotoSliderProps<T>) => {
  const [selected, setSelected] = useState(0)
  const [emblaRef] = useEmblaCarousel({ loop: true })
  useEffect(() => { if (startIndex && startIndex >= 0 && startIndex < photos.length) setSelected(startIndex) }, [startIndex])
  const prevHandler = () => {
    if (photos.length > 1) {
      if (selected === 0) setSelected(photos.length - 1)
      else setSelected(p => p - 1)
    }
  }
  const nextHandler = () => {
    if (photos.length > 1) {
      if (selected === photos.length - 1) setSelected(0)
      else setSelected(p => p + 1)
    }
  }

  return (

    <Dialog open={!!isOpen} onClose={() => onClose && onClose()} className={cn("z-50 relative ")}>
      <DialogBackdrop transition className="fixed top-0 bg-[rgba(44,59,72,0.80)] transition  w-screen max-w-full h-screen duration-150 ease-out data-[closed]:opacity-0" />
      <div className="fixed top-0 w-screen h-screen z-50 flex justify-center items-center"  >
        <DialogPanel onMouseDown={(e) => e.stopPropagation()} className="max-h-full overflow-auto  no-scrollbar  relative flex w-full h-full ">
          <div className="flex-col flex w-full  flex-1 h-full" >
            <div className="flex justify-between w-full opacity-80 p-8" >
              <span className="text-white">{selected + 1}/{photos.length}</span>
              <X color="white" className="transition-opacity cursor-pointer hover:opacity-80" onClick={() => onClose && onClose()} />
            </div>
            <div className=" flex justify-between h-full flex-1 "  >
              <div className="w-60 flex justify-center items-center  bg-[rgba(44,59,72,0.10)] rounded-tr-16 cursor-pointer group hover:bg-[rgba(44,59,72,0.30)] transition-colors md:hidden" onClick={prevHandler}>
                <MoveLeft className="stroke-white opacity-30 group-hover:opacity-70 transition-opacity " />
              </div>
              <div className="max-w-[calc(100%-160px)] max-h-[calc(100vh-50px)]  flex items-center justify-center  md:max-w-full px-12 flex-[0_0_100%] min-w-0 md:hidden" onClick={() => onClose && onClose()}>
                <img src={getUrl(photos[selected])} className="  max-h-full  select-none" onClick={e => e.stopPropagation()} />
              </div>
              <div className="overflow-hidden hidden md:block" ref={emblaRef}>
                <div className="flex h-full max-h-full">
                  {photos.map(e =>
                    <div className="max-w-[calc(100%-160px)] max-h-[calc(100vh-50px)]    flex items-center justify-center  md:max-w-full px-12 flex-[0_0_100%] min-w-0" onClick={() => onClose && onClose()} key={getUrl(e)}>
                      <img src={getUrl(e)} className="  max-h-full  select-none" onClick={e => e.stopPropagation()} />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-60  flex justify-center items-center  bg-[rgba(44,59,72,0.10)] rounded-tl-16 cursor-pointer group hover:bg-[rgba(44,59,72,0.30)] transition-colors md:hidden" onClick={nextHandler}>
                <MoveRight className="stroke-white opacity-30 group-hover:opacity-70 transition-opacity " />
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
};


interface PhotoSliderProps<T> {
  photos: T[];
  getUrl: (item: T) => string,
  onClick?: (item: T, index: number) => void
}
export const PhotoSlider = <T,>({ photos, getUrl, onClick }: PhotoSliderProps<T>) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  return (
    <>
      {photos.length > 0 &&
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="f-b3 text-accent">Фото {photos.length}</span>
            {emblaApi && emblaApi.canScrollNext() &&
              <div className="flex gap-4">
                <button onClick={() => emblaApi.scrollPrev()}><ChevronLeft /></button>
                <button onClick={() => emblaApi.scrollNext()}><ChevronRight /></button>
              </div>
            }
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {photos.map((e, i) =>
                <div className="flex-[0_0_120px] min-w-0 h-[172px]  mr-20 cursor-pointer" onClick={() => onClick && onClick(e, i)} key={getUrl(e)}>
                  <img src={getUrl(e)} className="object-cover  w-full h-full  object-center select-none" />
                </div>
              )}
            </div>
          </div>
        </div>
      }
    </>
  )
};


interface VideoSliderProps<T> {
  videos: T[];
  getUrl: (item: T) => string,
}
export const VideoSlider = <T,>({ videos, getUrl }: VideoSliderProps<T>) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  return (
    <>
      {videos.length > 0 &&
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between">
            <span className="f-b3 text-accent">Видео {videos.length}</span>
            {emblaApi && emblaApi.canScrollNext() &&
              <div className="flex gap-4">
                <button onClick={() => emblaApi.scrollPrev()}><ChevronLeft /></button>
                <button onClick={() => emblaApi.scrollNext()}><ChevronRight /></button>
              </div>
            }
          </div>
          <div className="overflow-hidden max-w-[240px] md:max-w-full" ref={emblaRef}>
            <div className="flex">
              {videos.map(e =>
                <div className="flex-[0_0_100%] min-w-0 h-[172px] md:h-full mr-20" key={getUrl(e)}>
                  <video src={getUrl(e)} className="object-cover  w-full h-full  object-center select-none" controls />
                </div>
              )}
            </div>
          </div>
        </div>
      }
    </>
  )
};
