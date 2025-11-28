import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useSendMessage } from '../../hooks/useChats';

type Props = {
  chatId: string;
};

export const MessageComposer = ({ chatId }: Props) => {
  const [text, setText] = useState('');
  const sendMessage = useSendMessage(chatId);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage.mutate(
      { type: 'text', text },
      {
        onSuccess: () => setText(''),
      },
    );
  };

  return (
    <div className="border-t border-white/5 p-6">
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
        <input
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
          placeholder="Напиши секретарю..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} isLoading={sendMessage.isPending}>
          Отправить
        </Button>
      </div>
    </div>
  );
};


