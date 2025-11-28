import React from 'react';
import { SettingsCard } from '../components/ui/SettingsCard';

export const SettingsPage: React.FC = () => {
  const [e2e, setE2e] = React.useState(true);
  const [autoplay, setAutoplay] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-snow-white mb-6">Настройки</h2>

      <SettingsCard title="Шифрование сообщений" description="End-to-end шифрование для полной конфиденциальности">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={e2e} 
            onChange={() => setE2e(s => !s)} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-zima-deep rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zima-ice"></div>
        </label>
      </SettingsCard>

      <SettingsCard title="Автовоспроизведение медиа" description="Автоматически воспроизводить медиафайлы при просмотре">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={autoplay} 
            onChange={() => setAutoplay(s => !s)} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-zima-deep rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zima-ice"></div>
        </label>
      </SettingsCard>

      <SettingsCard title="Уведомления" description="Получать уведомления о новых сообщениях">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={notifications} 
            onChange={() => setNotifications(s => !s)} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-zima-deep rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zima-ice"></div>
        </label>
      </SettingsCard>

      <SettingsCard title="Аккаунт" description="Управление аккаунтом и устройствами">
        <button className="px-4 py-2 rounded-lg border border-zima-ice text-zima-ice hover:bg-zima-ice hover:text-snow-white transition-colors">
          Управление
        </button>
      </SettingsCard>

      <SettingsCard title="Тема интерфейса" description="Выбор цветовой схемы приложения">
        <select className="bg-zima-deep border border-zima-ice text-snow-white rounded-lg px-3 py-2">
          <option>ZIMA Dark</option>
          <option>ZIMA Light</option>
          <option>Auto</option>
        </select>
      </SettingsCard>
    </div>
  );
};