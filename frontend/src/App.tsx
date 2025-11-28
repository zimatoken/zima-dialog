import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/" element={<div>Home works!</div>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-4 py-2 rounded-lg transition-all ${
      isActive 
        ? 'bg-zima-deep text-snow-white shadow-soft' 
        : 'text-snow-white/70 hover:text-snow-white hover:bg-zima-deep/50'
    }`;
  };

  return (
    <nav className="p-4 border-b border-zima-deep bg-[var(--panel)] flex gap-2">
      <Link to="/" className={getLinkClass('/')}>Чат</Link>
      <Link to="/ai" className={getLinkClass('/ai')}>AI</Link>
      <Link to="/settings" className={getLinkClass('/settings')}>Настройки</Link>
    </nav>
  );
};

// Главный экран чата
const ChatScreen: React.FC = () => (
  <div className="flex-1 flex flex-col">
    {/* Заголовок */}
    <div className="p-6 text-center border-b border-zima-deep">
      <h1 className="text-3xl font-bold text-snow-white mb-2">Zima Dialog</h1>
      <p className="text-crystal-glow">Pocket Secretary</p>
      <p className="text-zima-ice text-sm mt-1">Конфиденциальный AI-мессенджер с ледяным характером.</p>
    </div>

    {/* Область сообщений */}
    <div className="flex-1 p-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-zima-deep rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❄️</span>
        </div>
        <h2 className="text-xl font-bold text-snow-white mb-2">Добро пожаловать в ZIMA</h2>
        <p className="text-crystal-glow mb-4">
          Ваш конфиденциальный AI-помощник готов к работе. 
          Начните общение или настройте параметры безопасности.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-4 py-2 bg-zima-deep text-snow-white rounded-lg hover:bg-zima-ice transition-colors">
            Начать чат
          </button>
          <button className="px-4 py-2 border border-zima-ice text-zima-ice rounded-lg hover:bg-zima-ice hover:text-snow-white transition-colors">
            Настройки
          </button>
        </div>
      </div>
    </div>

    {/* Поле ввода */}
    <div className="p-4 border-t border-zima-deep bg-[var(--panel)]">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <input 
          type="text" 
          placeholder="Введите сообщение..."
          className="flex-1 bg-transparent border border-zima-deep rounded-lg px-4 py-3 text-snow-white placeholder:text-snow-white/50 outline-none"
        />
        <button className="px-6 py-3 bg-zima-deep text-snow-white rounded-lg hover:bg-zima-ice transition-colors">
          Отправить
        </button>
      </div>
    </div>
  </div>
);

// AI экран
const AiScreen: React.FC = () => (
  <div className="p-6 flex-1">
    <h2 className="text-2xl font-bold text-snow-white mb-6">AI Ассистент</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[var(--panel)] rounded-xl p-6 border border-zima-deep/50">
        <h3 className="text-lg font-semibold text-snow-white mb-3">Умный поиск</h3>
        <p className="text-crystal-glow">Быстрый поиск по истории сообщений и документам</p>
      </div>
      <div className="bg-[var(--panel)] rounded-xl p-6 border border-zima-deep/50">
        <h3 className="text-lg font-semibold text-snow-white mb-3">Автоматизация</h3>
        <p className="text-crystal-glow">Автоматические ответы и уведомления</p>
      </div>
    </div>
  </div>
);

// Настройки
const SettingsScreen: React.FC = () => (
  <div className="p-6 flex-1 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-snow-white mb-6">Настройки</h2>
    
    <div className="space-y-4">
      <div className="bg-[var(--panel)] rounded-xl p-4 border border-zima-deep/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-snow-white">Шифрование сообщений</div>
            <div className="text-sm text-crystal-glow mt-1">End-to-end шифрование</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-zima-deep rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zima-ice"></div>
          </label>
        </div>
      </div>

      <div className="bg-[var(--panel)] rounded-xl p-4 border border-zima-deep/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-snow-white">Уведомления</div>
            <div className="text-sm text-crystal-glow mt-1">Push-уведомления о новых сообщениях</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-zima-deep rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zima-ice"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg)] text-snow-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<ChatScreen />} />
            <Route path="/ai" element={<AiScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;