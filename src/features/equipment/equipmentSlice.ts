import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentItem } from '../../types/reputation';
import { BASIC_EQUIPMENT } from '../../data/equipment';

interface EquipmentState {
  ownedEquipment: EquipmentItem[];
  lastMaintenanceDate: string;
  maintenanceDue: boolean;
}

const initialState: EquipmentState = {
  ownedEquipment: [],
  lastMaintenanceDate: new Date().toISOString(),
  maintenanceDue: false,
};

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    purchaseEquipment: (state, action: PayloadAction<EquipmentItem>) => {
      state.ownedEquipment.push(action.payload);
    },
    
    removeEquipment: (state, action: PayloadAction<string>) => {
      state.ownedEquipment = state.ownedEquipment.filter(
        item => item.id !== action.payload
      );
    },
    
    updateEquipmentCondition: (state, action: PayloadAction<{ id: string; condition: number }>) => {
      const equipment = state.ownedEquipment.find(item => item.id === action.payload.id);
      if (equipment) {
        equipment.condition = Math.max(0, Math.min(100, action.payload.condition));
      }
    },
    
    performMaintenance: (state, action: PayloadAction<string>) => {
      const equipment = state.ownedEquipment.find(item => item.id === action.payload);
      if (equipment) {
        equipment.condition = 100;
      }
    },
    
    setLastMaintenanceDate: (state, action: PayloadAction<string>) => {
      state.lastMaintenanceDate = action.payload;
      state.maintenanceDue = false;
    },
    
    setMaintenanceDue: (state, action: PayloadAction<boolean>) => {
      state.maintenanceDue = action.payload;
    },
    
    // מעדכן את מצב כל הציוד בכל יום
    updateDailyCondition: (state) => {
      state.ownedEquipment.forEach(equipment => {
        // מחשב את קצב הירידה היומי בהתבסס על העמידות
        const dailyDegradation = 100 / (equipment.durability * 30);
        equipment.condition = Math.max(0, equipment.condition - dailyDegradation);
      });
    },
    
    // מאתחל את הציוד הבסיסי בתחילת המשחק
    initializeBasicEquipment: (state) => {
      state.ownedEquipment = [...BASIC_EQUIPMENT];
    },
  },
});

export const {
  purchaseEquipment,
  removeEquipment,
  updateEquipmentCondition,
  performMaintenance,
  setLastMaintenanceDate,
  setMaintenanceDue,
  updateDailyCondition,
  initializeBasicEquipment,
} = equipmentSlice.actions;

export default equipmentSlice.reducer; 