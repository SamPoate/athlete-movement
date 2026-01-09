import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ClassLayout = 'grid' | 'list';
export type Theme = 'dark' | 'midnight' | 'neon' | 'retro' | 'vice' | 'cny' | 'barbie' | 'vaporwave' | 'matrix';

interface AppState {
  cardId: string | null;
  layout: ClassLayout;
  theme: Theme;
}

const initialState: AppState = {
  cardId: null,
  layout: 'list',
  theme: 'dark'
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCardId: (state, { payload }: PayloadAction<string | null>) => {
      state.cardId = payload;
    },
    setLayout: (state, { payload }: PayloadAction<ClassLayout>) => {
      state.layout = payload;
    },
    setTheme: (state, { payload }: PayloadAction<Theme>) => {
      state.theme = payload;
    }
  }
});

export const { setCardId, setLayout, setTheme } = appSlice.actions;

export default appSlice;
