import { useMemo } from 'react';
import { useMessages } from '../../hooks/useChats';
import { useAuthStore } from '../../store/authStore';
import { MessageComposer } from '../messages/MessageComposer';
import { Badge } from '../../components/ui/badge';

type ChatWindowProps = {
  chatId?: string;
};

export const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const { data, isLoading } = useMessages(chatId);
  const me = useAuthStore((s) => s.currentUser);

  const grouped = useMemo(() => {
    if (!data) return [];
    return data.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [data]);

  if (!chatId) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/50">
        Выберите чат или создайте новый, чтобы начать ледяной диалог.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-8 py-4">
        <div>
          <p className="text-xl font-semibold text-white">Чат #{chatId.slice(0, 4)}</p>
          <p className="text-sm text-white/50">AI секретарь подключен</p>
        </div>
        <Badge tone="default">❄️ ZIMA Secure</Badge>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading && <p className="text-white/50">Загрузка сообщений...</p>}
        {grouped.map((message) => {
          const isMe = message.senderId === me?.id;
          const isAI = message.senderId === 'system';
          return (
            <div key={message.id} className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl rounded-3xl px-5 py-3 text-sm leading-relaxed ${
                  isAI
                    ? 'bg-ice-blue text-abyss shadow-ice'
                    : isMe
                      ? 'bg-white/15 text-white backdrop-blur'
                      : 'bg-white/5 text-white/90'
                }`}
              >
                {isAI && <div className="text-xs uppercase tracking-[0.4em] text-abyss/60">ZIMA AI</div>}
                {message.content || ''}
                <div className="mt-2 text-right text-xs text-white/50">{new Date(message.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer chatId={chatId} />
    </div>
  );
};


