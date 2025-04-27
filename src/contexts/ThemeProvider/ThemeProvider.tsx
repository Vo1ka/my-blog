import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ThemeProviderProps{
    children: React.ReactNode;
}
export const ThemeProvider = ({ children }:ThemeProviderProps) => {
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return <>{children}</>;
};