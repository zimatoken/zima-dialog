import { Outlet } from '@tanstack/react-router';
import { Sidebar } from '../modules/navigation/Sidebar';
import { SocketProvider } from '../providers/SocketProvider';
import { AiTaskPanel } from '../modules/ai/AiTaskPanel';

export const AppLayout = () => (
  <SocketProvider>
    <div className="flex h-screen w-full bg-abyss text-white">
      <Sidebar />
      <main className="flex flex-1 flex-col bg-night/40 backdrop-blur-xl">
        <div className="flex flex-1">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
          <AiTaskPanel />
        </div>
      </main>
    </div>
  </SocketProvider>
);


