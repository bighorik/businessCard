import cn from 'classnames';

export const Divider = ({ ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => {
  return (
    <hr {...props} className={cn("text-gray-3 mt-8 w-full border-0", props.className)} />
  )
};