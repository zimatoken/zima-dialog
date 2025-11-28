import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Input = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-ice-blue focus:bg-white/10',
      className,
    )}
    {...rest}
  />
);


