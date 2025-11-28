import { create } from 'zustand';

type Message = { id: string; text: string; from: 'me' | 'other'; ts: number };

type State = {
  messages: Message[];
  addMessage: (m: Message) => void;
  clear: () => void;
};

export const useChatStore = create<State>((set) => ({
  messages: [],
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  clear: () => set({ messages: [] }),
}));