import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>,
);


