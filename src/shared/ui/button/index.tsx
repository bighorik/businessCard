import cn from 'classnames';
import { LoaderCircle } from 'lucide-react';
import React from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isLoading?: boolean,
}
interface LinkButtonProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  isLoading?: boolean,
  selectedCondition?: (href: string) => boolean,
}

export const Button = ({ isLoading, className, children, ...props }: ButtonProps) => {

  return (
    <button className={cn('text-white bg-accent rounded-8 py-9 px-16 border border-transparent f-b4 text-bold hover:bg-on-accent transition-colors disabled:bg-gray-1', className)} {...props}>
      {isLoading ?
        <div className='w-full flex justify-center items-center'> <LoaderCircle className='animate-spin self-center' color='white' size={20} /></div> :
        children
      }
    </button>
  )
};


export const LinkButton = ({ isLoading, className, children, selectedCondition, ...props }: LinkButtonProps) => {
  return (
    <a className={cn(
      'flex text-white bg-accent rounded-8 py-9 px-16 border border-transparent f-b4 text-bold',
      'no-underline hover:no-underline hover:text-white items-center justify-center',
      className)} {...props}>
      {isLoading ?
        <div className='w-full flex justify-center items-center'> <LoaderCircle className='animate-spin self-center' color='white' size={20} /></div> :
        children
      }
    </a>
  )
};

