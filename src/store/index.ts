import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import playersReducer from './slices/playersSlice'
import financeReducer from './slices/financeSlice'
import gameReducer from './slices/gameSlice'
import agentReducer from './slices/agentSlice'
import assetsReducer from './slices/assetsSlice'
import equipmentReducer from './slices/equipmentSlice'
import scoutingReducer from './slices/scoutingSlice'
import contactsReducer from './slices/contactsSlice'
import missionsReducer from './slices/missionsSlice'
import eventsReducer from './slices/eventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playersReducer,
    finance: financeReducer,
    game: gameReducer,
    agent: agentReducer,
    assets: assetsReducer,
    equipment: equipmentReducer,
    scouting: scoutingReducer,
    contacts: contactsReducer,
    missions: missionsReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 