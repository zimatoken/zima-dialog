import { ReactNode, useEffect } from 'react';

const addThemeClass = () => document.documentElement.classList.add('dark');

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    addThemeClass();
  }, []);

  return children;
};


