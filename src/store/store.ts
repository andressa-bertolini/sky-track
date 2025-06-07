import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import flightsReducer from './flightsSlice'; // ou o nome do seu slice

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();