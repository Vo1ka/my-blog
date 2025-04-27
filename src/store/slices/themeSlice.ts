import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

// Проверяем сохранённую тему в localStorage
const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    return savedTheme || 'light';
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.mode)
        },

        setTheme: (state, action:PayloadAction<ThemeMode>) =>{
            state.mode = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
})

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;