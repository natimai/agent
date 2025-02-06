import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import playersReducer from './slices/playersSlice';
import transfersReducer from './slices/transfersSlice';
import officeReducer from './slices/officeSlice';
import treasuryReducer from './slices/treasurySlice';
import notificationsReducer from './slices/notificationsSlice';
import teamReducer from './slices/teamSlice';
import authReducer from './slices/authSlice';
import financeReducer from './slices/financeSlice';
import gameReducer from './slices/gameSlice';
import agentReducer from './slices/agentSlice';
import assetsReducer from './slices/assetsSlice';
import equipmentReducer from './slices/equipmentSlice';
import scoutingReducer from './slices/scoutingSlice';
import contactsReducer from './slices/contactsSlice';
import eventsReducer from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playersReducer,
    transfers: transfersReducer,
    office: officeReducer,
    treasury: treasuryReducer,
    notifications: notificationsReducer,
    team: teamReducer,
    finance: financeReducer,
    game: gameReducer,
    agent: agentReducer,
    assets: assetsReducer,
    equipment: equipmentReducer,
    scouting: scoutingReducer,
    contacts: contactsReducer,
    events: eventsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 