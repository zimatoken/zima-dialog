import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuthStore } from '../store/authStore';
import { LoginPhoneForm } from '../features/auth/LoginPhoneForm';
import { ChatSidebar } from '../modules/chats/ChatSidebar';
import { ChatWindow } from '../modules/chats/ChatWindow';
import { Outlet } from '@tanstack/react-router';

const SettingsPage = lazy(() => import('../screens/SettingsScreen'));
const AiScreen = lazy(() => import('../screens/AiScreen'));

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: () => {
    if (!useAuthStore.getState().session) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AppLayout,
});

const chatsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: ChatsPage,
});

const aiRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/ai',
  component: AiPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/settings',
  component: SettingsPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  beforeLoad: () => {
    if (useAuthStore.getState().session) {
      throw redirect({ to: '/' });
    }
  },
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/auth/login',
  component: LoginPhoneForm,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute.addChildren([chatsRoute, aiRoute, settingsRoute]),
  authRoute.addChildren([loginRoute]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string>();
  return (
    <div className="flex h-full">
      <ChatSidebar selectedChatId={selectedChat} onSelect={setSelectedChat} />
      <ChatWindow chatId={selectedChat} />
    </div>
  );
}

function AiPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white/60">Загрузка AI панели...</div>}>
      <AiScreen />
    </Suspense>
  );
}

