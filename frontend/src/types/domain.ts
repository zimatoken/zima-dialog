export type DeviceInfo = {
  deviceId: string;
  platform?: string;
  appVersion?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  phone: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export type Chat = {
  id: string;
  type: 'direct' | 'group';
  ai_enabled: boolean;
  ai_mode: string;
  participants: Array<{
    userId: string;
    name: string;
    avatarUrl?: string | null;
    lastReadAt?: string | null;
  }>;
  lastMessage?: Message | null;
  updatedAt: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  type: string;
  content?: string | null;
  createdAt: string;
  deliveredTo: string[];
  seenBy: string[];
};

export type AiJob = {
  id: string;
  status: string;
  model: string;
  prompt?: string | null;
  result?: string | null;
  createdAt: string;
};


