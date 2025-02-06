import { GameState } from '../store/slices/gameSlice';
import { FinanceState } from '../types/finance';
import { AuthState } from '../store/slices/authSlice';
import { PlayersState } from '../types/players';
import { AgentState } from '../store/slices/agentSlice';
import { AssetsState } from '../types/assets';
import { EquipmentState } from '../store/slices/equipmentSlice';
import { ScoutingState } from '../types/scouting';
import { ContactsState } from '../types/contacts';

export interface RootState {
  auth: AuthState;
  players: PlayersState;
  finance: FinanceState;
  game: GameState;
  agent: AgentState;
  assets: AssetsState;
  equipment: EquipmentState;
  scouting: ScoutingState;
  contacts: ContactsState;
} 