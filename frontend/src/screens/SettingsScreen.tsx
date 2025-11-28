import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/authStore';

const SettingsScreen = () => {
  const user = useAuthStore((s) => s.currentUser);

  return (
    <div className="grid gap-6 p-6 text-white md:grid-cols-2">
      <Card>
        <h2 className="text-xl font-semibold">Профиль</h2>
        <p className="text-sm text-white/60">Управляйте данными аккаунта</p>
        <div className="mt-4 space-y-2 text-white/80">
          <div>
            <p className="text-sm text-white/40">Телефон</p>
            <p className="text-lg font-medium">{user?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Имя</p>
            <p className="text-lg font-medium">{user?.name || 'Не задано'}</p>
          </div>
        </div>
        <Button className="mt-4" variant="outline">
          Обновить профиль
        </Button>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Безопасность</h2>
        <p className="text-sm text-white/60">Управляйте устройствами и сессиями</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/70">
          <li>Устройства с активными токенами</li>
          <li>Включить Web3-хранилище ключей (скоро)</li>
          <li>Запустить пересоздание ключей E2E</li>
        </ul>
        <Button className="mt-4" variant="ghost">
          Управление устройствами
        </Button>
      </Card>
    </div>
  );
};

export default SettingsScreen;


