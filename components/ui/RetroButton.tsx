import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'neutral';
  className?: string;
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}) => {
  const baseStyles = "min-h-11 px-4 py-2 font-retro font-bold text-sm border-3 border-black shadow-retro transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-retro-active disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    accent: "bg-black text-white hover:bg-gray-800",
    neutral: "bg-white text-black hover:bg-gray-100"
  };

  return (
    <button 
      type="button"
      className={cn(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
