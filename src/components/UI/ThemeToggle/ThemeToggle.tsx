import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toggleTheme } from '../../../store/slices/themeSlice';
import './ThemeToggle.scss'

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <button 
      onClick={() => dispatch(toggleTheme())}
      className="theme-toggle"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;