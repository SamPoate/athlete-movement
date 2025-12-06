import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appSlice from './slices/appSlice';

const reducers = {
  [appSlice.name]: appSlice.reducer
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

export const rootReducer: Reducer<RootState> = (state, action) => {
  if (action.type === 'reset') {
    state = {} as RootState;
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;

export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
