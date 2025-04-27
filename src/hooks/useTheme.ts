// hooks/useTheme.ts
import { useSelector } from 'react-redux';
import { RootState } from '../store';


export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  return { theme, isDark: theme === 'dark' };
};