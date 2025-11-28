import { create } from 'zustand';
import { AuthSession, User } from '../types/domain';

type AuthState = {
  session: AuthSession | null;
  currentUser: User | null;
  setSession: (payload: { session: AuthSession; user: User }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  currentUser: null,
  setSession: ({ session, user }) => set({ session, currentUser: user }),
  clearSession: () => set({ session: null, currentUser: null }),
}));


