import React from 'react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  variant?: 'user' | 'system';
  className?: string;
};

export const MessageBubble: React.FC<Props> = ({ children, variant = 'user', className }) => {
  const base = 'inline-block px-4 py-2 rounded-xl max-w-[70%]';
  const styles = {
    user: 'bg-zima-deep text-snow-white rounded-br-none',
    system: 'bg-zima-night text-crystal-glow rounded-bl-none',
  };
  return <div className={clsx(base, styles[variant], className)}>{children}</div>;
};