import { useState } from 'react';
import { useChats } from '../../hooks/useChats';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

type ChatSidebarProps = {
  selectedChatId?: string;
  onSelect: (chatId: string) => void;
};

export const ChatSidebar = ({ selectedChatId, onSelect }: ChatSidebarProps) => {
  const { data, isLoading } = useChats();
  const [filter, setFilter] = useState('');

  return (
    <div className="flex w-96 flex-col border-r border-white/10 bg-night/40">
      <div className="p-4">
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 outline-none"
          placeholder="Поиск..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading && <p className="p-4 text-white/50">Загрузка чатов...</p>}
        {data
          ?.filter((chat) => chat.participants.some((p) => p.name?.toLowerCase().includes(filter.toLowerCase())))
          .map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={cn(
                'mb-2 w-full rounded-2xl border border-transparent p-4 text-left transition hover:border-white/20',
                selectedChatId === chat.id && 'border-ice-blue bg-white/5',
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {chat.participants.map((p) => p.name || p.userId).slice(0, 3).join(', ')}
                </p>
                {chat.ai_enabled && <Badge tone="success">AI</Badge>}
              </div>
              <p className="line-clamp-2 text-sm text-white/60">{chat.lastMessage?.content || 'Пока пусто...'}</p>
            </button>
          ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <Button className="w-full" variant="outline">
          + Новый чат
        </Button>
      </div>
    </div>
  );
};


