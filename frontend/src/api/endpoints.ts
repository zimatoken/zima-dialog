import { apiClient } from './client';
import type { AuthSession, Chat, Message, User, DeviceInfo, AiJob } from '../types/domain';

export const authApi = {
  sendCode: (phone: string) => apiClient.post<{ ttl: number }>('/auth/send-code', { phone }),
  verify: (payload: { phone: string; code: string; deviceInfo: DeviceInfo }) =>
    apiClient.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/verify', payload),
  refresh: (refreshToken: string) => apiClient.post<{ accessToken: string; expiresIn: number }>('/auth/refresh', { refreshToken }),
};

export const chatsApi = {
  list: (params?: { limit?: number; offset?: number }) =>
    apiClient.get<Chat[]>('/chats', { params }).then((res) => res.data),
  create: (userIds: string[]) => apiClient.post<Chat>('/chats', { userIds }).then((res) => res.data),
  updateAi: (chatId: string, dto: Partial<Chat>) => apiClient.put<Chat>(`/chats/${chatId}/ai-settings`, dto).then((res) => res.data),
};

export const messagesApi = {
  list: (chatId: string, params?: { limit?: number; offset?: number }) =>
    apiClient.get<Message[]>(`/messages/${chatId}`, { params }).then((res) => res.data),
  send: (chatId: string, payload: { type: string; text?: string; mediaId?: string; replyToId?: string }) =>
    apiClient.post<Message>(`/messages/${chatId}/send`, payload).then((res) => res.data),
  markRead: (messageId: string) => apiClient.post('/messages/mark-read', { messageId }),
};

export const usersApi = {
  me: () => apiClient.get<User>('/users/me').then((res) => res.data),
};

export const aiApi = {
  listTasks: (params?: { limit?: number; offset?: number; status?: string }) =>
    apiClient.get<AiJob[]>('/ai/tasks', { params }).then((res) => res.data),
  getTask: (taskId: string) => apiClient.get<AiJob>(`/ai/tasks/${taskId}`).then((res) => res.data),
};


