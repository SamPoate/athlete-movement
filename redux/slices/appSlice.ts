import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  cardId: number | null;
}

const initialState: AppState = {
  cardId: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCardId: (state, { payload }: PayloadAction<number | null>) => {
      state.cardId = payload;
    }
  }
});

export const { setCardId } = appSlice.actions;

export default appSlice;
