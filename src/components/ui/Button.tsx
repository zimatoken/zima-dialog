import React from 'react';
import clsx from 'clsx';

type Props = {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Button: React.FC<Props> = ({ variant = 'primary', children, className, onClick }) => {
  const base = 'px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center justify-center';
  const variants = {
    primary: 'bg-zima-deep text-snow-white shadow-soft',
    secondary: 'border border-zima-ice text-zima-ice bg-transparent',
    ghost: 'bg-transparent text-snow-white/80',
  };
  return (
    <button className={clsx(base, variants[variant], className)} onClick={onClick}>
      {children}
    </button>
  );
};
