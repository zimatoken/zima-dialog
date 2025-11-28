import { Outlet } from '@tanstack/react-router';

export const AuthLayout = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-abyss text-white">
    <div className="max-w-md flex-1 p-6">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-white/60">Zima Dialog</p>
        <h1 className="text-4xl font-display font-semibold text-ice-blue">Pocket Secretary</h1>
        <p className="text-white/60">Конфиденциальный AI-мессенджер с ледяным характером.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
        <Outlet />
      </div>
    </div>
  </div>
);


