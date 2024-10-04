import { DialogBackdrop, Dialog as DialogComponent, DialogPanel } from '@headlessui/react';

import cn from 'classnames';
import { X } from 'lucide-react';
import { PropsWithChildren } from 'react';

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  mobileSlider?: boolean
}

interface ExitProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {

}

export function Dialog({ children, isOpen, onClose, mobileSlider }: PropsWithChildren<ModalProps>) {

  return (
    <DialogComponent open={isOpen} onClose={() => { onClose && onClose() }}
      className={cn("z-50 relative ")}>
      <DialogBackdrop
        transition
        className={cn("fixed top-0 bg-[rgba(44,59,72,0.60)] transition  w-screen h-screen duration-150 ease-out data-[closed]:opacity-0",
          mobileSlider && "md:data-[closed]:delay-150"
        )}
      />
      <div className={cn("fixed top-0 w-screen h-screen z-50 justify-center flex  items-center py-72  md:py-24 px-12 ", mobileSlider && "md:px-0 md:pb-0 md:pt-48")}  >
        <DialogPanel transition onMouseDown={(e) => e.stopPropagation()}
          className={cn("max-h-full flex overflow-y-auto no-scrollbar justify-center  transition ease-out data-[closed]:opacity-0 relative *:shadow-xl",
            mobileSlider && "md:data-[closed]:translate-y-full md:data-[opened]:delay-150 duration-200 md:data-[closed]:opacity-100 md:w-full  md:*:first:rounded-t-16"
          )}>
          {children}
        </DialogPanel>
      </div>
    </DialogComponent>
  )
}


Dialog.Exit = (props: ExitProps) => {
  return (
    <button type='button'  {...props} className={cn('absolute right-20 top-20 opacity-80 transition-opacity self-end !bg-transparent hover:opacity-85 ', props.className)}>
      <X />
    </button>
  )
}
