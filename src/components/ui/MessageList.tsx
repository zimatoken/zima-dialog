import React from 'react';
import { MessageBubble } from './MessageBubble';

type Message = { id: string; text: string; from: 'me' | 'other'; ts: number };

export const MessageList: React.FC<{ items: Message[] }> = ({ items }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [items]);

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pb-4">
      {items.map((m) => (
        <div key={m.id} className={m.from === 'me' ? 'self-end flex justify-end' : 'self-start flex justify-start'}>
          <MessageBubble variant={m.from === 'me' ? 'user' : 'system'}>
            <div className="break-words">{m.text}</div>
          </MessageBubble>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center text-crystal-glow/60 mt-8">
          Начните общение - отправьте первое сообщение
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};