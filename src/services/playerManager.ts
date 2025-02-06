import store from '../store';
import { OFFICE_LEVELS } from '../data/office';
import { Player } from '../types/player';

class PlayerManager {
  canAddPlayer(): boolean {
    const state = store.getState();
    const currentPlayers = state.players.players.length;
    const maxPlayers = OFFICE_LEVELS[state.office.currentLevel - 1].maxPlayers;
    
    return currentPlayers < maxPlayers;
  }

  addPlayer(player: Player) {
    if (!this.canAddPlayer()) {
      throw new Error('הגעת למגבלת השחקנים של המשרד. שדרג את המשרד כדי להוסיף שחקנים נוספים.');
    }
    
    // ... המשך הלוגיקה הקיימת
  }
}

export default new PlayerManager(); 