import store from '../store';
import { GameSave } from '../types/game';

const SAVE_KEY = 'FOOTBALL_AGENT_SAVE';

export const saveManager = {
  saveGame: () => {
    const state = store.getState();
    const gameSave: GameSave = {
      saveDate: new Date().toISOString(),
      gameState: state.game,
      players: state.players.players,
      user: state.auth.user,
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameSave));
    return gameSave;
  },

  loadGame: (): GameSave | null => {
    const savedGame = localStorage.getItem(SAVE_KEY);
    if (!savedGame) return null;
    return JSON.parse(savedGame);
  },

  deleteSave: () => {
    localStorage.removeItem(SAVE_KEY);
  },

  // אוטומטי שומר כל 5 דקות
  startAutoSave: () => {
    setInterval(() => {
      saveManager.saveGame();
    }, 5 * 60 * 1000);
  }
}; 