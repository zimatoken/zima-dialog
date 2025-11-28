import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatsApi, messagesApi } from '../api/endpoints';
import type { Chat, Message } from '../types/domain';

export const useChats = () =>
  useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsApi.list(),
  });

export const useMessages = (chatId?: string) =>
  useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => (chatId ? messagesApi.list(chatId) : Promise.resolve<Message[]>([])),
    enabled: Boolean(chatId),
    refetchInterval: 10_000,
  });

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { type: string; text?: string; mediaId?: string; replyToId?: string }) => messagesApi.send(chatId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });
};

export const useAiSettings = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Chat>) => chatsApi.updateAi(chatId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};


