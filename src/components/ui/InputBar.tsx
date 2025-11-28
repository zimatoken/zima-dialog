import React from 'react';
import { Button } from './Button';

export const InputBar: React.FC<{ onSend?: (text: string) => void }> = ({ onSend }) => {
  const [text, setText] = React.useState('');

  return (
    <div className="w-full p-4 bg-[var(--panel)] rounded-t-lg flex gap-3 items-center shadow-soft">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSend?.(text);
            setText('');
          }
        }}
        className="flex-1 bg-transparent outline-none text-snow-white placeholder:text-snow-white/50 px-4 py-3 rounded-lg border border-zima-deep"
        placeholder="Напишите сообщение..."
      />
      <Button
        variant="primary"
        onClick={() => {
          onSend?.(text);
          setText('');
        }}
      >
        Отправить
      </Button>
    </div>
  );
};