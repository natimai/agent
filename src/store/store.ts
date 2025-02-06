import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types/types';
import playersReducer from './slices/playersSlice';
import transfersReducer from './slices/transfersSlice';
import officeReducer from './slices/officeSlice';
import treasuryReducer from './slices/treasurySlice';
import notificationsReducer from './slices/notificationsSlice';
import teamReducer from './slices/teamSlice';

const store = configureStore({
  reducer: {
    players: playersReducer,
    transfers: transfersReducer,
    office: officeReducer,
    treasury: treasuryReducer,
    notifications: notificationsReducer,
    team: teamReducer
  }
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store }; 