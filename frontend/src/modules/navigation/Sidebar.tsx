import { Link } from '@tanstack/react-router';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
  const user = useAuthStore((s) => s.currentUser);
  const clear = useAuthStore((s) => s.clearSession);

  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-abyss/80 p-6 shadow-ice">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.5em] text-white/50">Zima</div>
        <h2 className="text-2xl font-display text-ice-blue">Dialog ❄️</h2>
        <p className="text-sm text-white/60">AI Pocket Secretary</p>
      </div>

      <nav className="flex flex-col gap-2 text-white/70">
        <Link to="/" className="rounded-xl px-4 py-2 text-base hover:bg-white/10">
          Чаты
        </Link>
        <Link to="/ai" className="rounded-xl px-4 py-2 text-base hover:bg-white/10">
          AI задачи
        </Link>
        <Link to="/settings" className="rounded-xl px-4 py-2 text-base hover:bg-white/10">
          Настройки
        </Link>
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Сессия</p>
        <p className="text-lg font-semibold">{user?.name || user?.phone}</p>
        <p className="text-sm text-white/60">{user?.phone}</p>
        <Button className="mt-4 w-full" variant="ghost" onClick={clear}>
          Выйти
        </Button>
      </div>
    </aside>
  );
};


