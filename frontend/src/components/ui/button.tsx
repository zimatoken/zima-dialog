import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-ice-blue text-abyss shadow-ice hover:brightness-110 focus-visible:outline-ice-blue',
        ghost: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
        outline: 'border border-ice-blue text-ice-blue hover:bg-ice-blue/10',
        danger: 'bg-danger text-white hover:brightness-110 focus-visible:outline-danger',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-2.5 text-lg',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };

export const Button = ({
  className,
  variant,
  size,
  isLoading,
  iconLeft,
  iconRight,
  children,
  ...rest
}: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} disabled={isLoading || rest.disabled} {...rest}>
    {iconLeft && <span className="mr-2">{iconLeft}</span>}
    <span>{isLoading ? 'Загрузка...' : children}</span>
    {iconRight && <span className="ml-2">{iconRight}</span>}
  </button>
);


