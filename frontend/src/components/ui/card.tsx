import { cn } from '../../utils/cn';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glass?: boolean;
};

export const Card = ({ className, glass = true, ...rest }: CardProps) => (
  <div
    className={cn(
      'rounded-2xl border border-white/10 p-6',
      glass && 'bg-white/5 backdrop-blur-xl',
      !glass && 'bg-night/60',
      className,
    )}
    {...rest}
  />
);


