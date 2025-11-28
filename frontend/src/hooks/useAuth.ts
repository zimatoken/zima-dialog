import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, usersApi } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';
import type { DeviceInfo } from '../types/domain';

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    enabled: Boolean(useAuthStore.getState().session),
  });

export const useAuthFlows = () => {
  const setSession = useAuthStore((s) => s.setSession);

  const sendCode = useMutation({
    mutationFn: (phone: string) => authApi.sendCode(phone),
  });

  const verifyCode = useMutation({
    mutationFn: async (payload: { phone: string; code: string; deviceInfo: DeviceInfo }) => {
      const response = await authApi.verify(payload);
      setSession({ session: response.data as unknown as { accessToken: string; refreshToken: string }, user: response.data.user });
      return response.data;
    },
  });

  return { sendCode, verifyCode };
};


