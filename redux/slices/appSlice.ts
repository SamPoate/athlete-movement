import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  card: string | null;
}

const initialState: AppState = {
  card: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCard: (state, { payload }: PayloadAction<string | null>) => {
      state.card = payload;
    }
  }
});

export const { setCard } = appSlice.actions;

export default appSlice;
