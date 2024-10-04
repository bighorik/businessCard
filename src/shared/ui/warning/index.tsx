import cn from 'classnames';
import { Info } from 'lucide-react';

export const Warning = ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div {...props} className={cn("bg-warn w-full p-12 rounded-8 f-b4 flex gap-12 items-end ", props.className)}>
      <Info className='self-start' />
      {children}
    </div>
  )
};
