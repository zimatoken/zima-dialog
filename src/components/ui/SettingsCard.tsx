import React from 'react';

export const SettingsCard: React.FC<{
  title: string;
  description?: string;
  children?: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="bg-[var(--panel)] rounded-xl p-6 shadow-soft border border-zima-deep/50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-snow-white text-lg">{title}</div>
          {description && <div className="text-sm text-crystal-glow/80 mt-1">{description}</div>}
        </div>
        <div className="ml-4">{children}</div>
      </div>
    </div>
  );
};