import React from 'react';
import { Avatar } from '../ui/Avatar';
import { InputBar } from '../ui/InputBar';

export const ChatLayout: React.FC<{ children?: React.ReactNode; onSend?: (t: string) => void }> = ({
  children,
  onSend,
}) => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-snow-white flex flex-col">
      <header className="h-14 flex items-center px-6 border-b border-zima-deep bg-[var(--panel)]">
        <div className="flex items-center gap-3">
          <Avatar size={40} />
          <div className="text-lg font-bold">ZIMA-Dialog</div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-6 py-4 bg-[var(--bg)]">{children}</main>

      <footer className="bg-[var(--panel)]">
        <InputBar onSend={onSend} />
      </footer>
    </div>
  );
};