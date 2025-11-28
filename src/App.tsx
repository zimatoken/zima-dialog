import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-[#091235] text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Zima Dialog</h1>
      <p className="text-xl mb-2">Pocket Secretary</p>
      <p className="text-gray-400 mb-8">Конфиденциальный AI-мессенджер с ледяным характером.</p>
      <div className="space-x-4">
        <Link to="/chat" className="bg-blue-600 px-6 py-3 rounded-lg">Чат</Link>
        <Link to="/ai" className="bg-gray-700 px-6 py-3 rounded-lg">AI</Link>
        <Link to="/settings" className="bg-gray-700 px-6 py-3 rounded-lg">Настройки</Link>
      </div>
    </div>
  </div>
);

const Chat = () => (
  <div className="min-h-screen bg-[#091235] text-white p-8">
    <h2 className="text-2xl font-bold mb-4">Чат</h2>
    <div className="bg-[#14202E] p-4 rounded-lg">
      <p>Здесь будет интерфейс чата...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/ai" element={<div className="min-h-screen bg-[#091235] text-white p-8">AI Ассистент</div>} />
        <Route path="/settings" element={<div className="min-h-screen bg-[#091235] text-white p-8">Настройки</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;