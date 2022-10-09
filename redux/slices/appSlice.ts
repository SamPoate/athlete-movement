import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  card: Item | null;
}

const initialState: AppState = {
  card: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCard: (state, { payload }: PayloadAction<Item | null>) => {
      state.card = payload;
    }
  }
});

export const { setCard } = appSlice.actions;

export default appSlice;
