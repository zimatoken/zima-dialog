import React from 'react';
import { ChatLayout } from '../components/layout/ChatLayout';
import { useChatStore } from '../store/useChatStore';
import { MessageList } from '../components/ui/MessageList';
import { v4 as uuidv4 } from 'uuid';

export const ChatPage: React.FC = () => {
  const { messages, addMessage } = useChatStore();

  const onSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage = {
      id: uuidv4(),
      text,
      from: 'me' as const,
      ts: Date.now(),
    };
    
    addMessage(newMessage);
    
    // Имитация ответа через 1-2 секунды
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: `Ответ на: "${text}"`,
        from: 'other',
        ts: Date.now(),
      });
    }, 1000 + Math.random() * 1000);
  };

  return (
    <ChatLayout onSend={onSend}>
      <div className="h-full flex flex-col">
        <MessageList items={messages} />
      </div>
    </ChatLayout>
  );
};