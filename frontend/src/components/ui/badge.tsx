import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-white/10 text-white',
  success: 'bg-emerald-400/20 text-emerald-200',
  warning: 'bg-amber-400/20 text-amber-200',
  danger: 'bg-danger/20 text-danger',
};

export const Badge = ({ className, tone = 'default', ...rest }: BadgeProps) => (
  <span className={cn('rounded-full px-3 py-1 text-xs font-medium', toneClasses[tone], className)} {...rest} />
);


