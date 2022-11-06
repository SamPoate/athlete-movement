import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ClassLayout = 'grid' | 'list';
interface AppState {
  cardId: number | null;
  layout: ClassLayout;
}

const initialState: AppState = {
  cardId: null,
  layout: 'list'
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCardId: (state, { payload }: PayloadAction<number | null>) => {
      state.cardId = payload;
    },
    setLayout: (state, { payload }: PayloadAction<ClassLayout>) => {
      state.layout = payload;
    }
  }
});

export const { setCardId, setLayout } = appSlice.actions;

export default appSlice;
