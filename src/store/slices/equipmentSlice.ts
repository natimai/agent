import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentItem } from '../../types/reputation';

export interface EquipmentState {
  ownedEquipment: EquipmentItem[];
  totalMaintenance: number;
  totalBenefits: {
    staffEfficiency: number;
    playerDevelopment: number;
    scoutingAccuracy: number;
    negotiationPower: number;
    reputationBonus: number;
    comfort: number;
    productivity: number;
    dataAnalysis: number;
    injuryPrevention: number;
    recoverySpeed: number;
    negotiationSuccess: number;
    clientSatisfaction: number;
  };
}

const initialState: EquipmentState = {
  ownedEquipment: [],
  totalMaintenance: 0,
  totalBenefits: {
    staffEfficiency: 0,
    playerDevelopment: 0,
    scoutingAccuracy: 0,
    negotiationPower: 0,
    reputationBonus: 0,
    comfort: 0,
    productivity: 0,
    dataAnalysis: 0,
    injuryPrevention: 0,
    recoverySpeed: 0,
    negotiationSuccess: 0,
    clientSatisfaction: 0
  }
};

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    purchaseEquipment: (state, action: PayloadAction<EquipmentItem>) => {
      const equipment = action.payload;
      state.ownedEquipment.push({
        ...equipment,
        condition: 100
      });
      state.totalMaintenance += equipment.monthlyMaintenance;

      // עדכון הבונוסים הכוללים
      Object.entries(equipment.benefits).forEach(([key, value]) => {
        if (key in state.totalBenefits) {
          state.totalBenefits[key as keyof typeof state.totalBenefits] += value;
        }
      });
    },

    removeEquipment: (state, action: PayloadAction<string>) => {
      const equipmentId = action.payload;
      const equipment = state.ownedEquipment.find(e => e.id === equipmentId);
      
      if (equipment) {
        state.ownedEquipment = state.ownedEquipment.filter(e => e.id !== equipmentId);
        state.totalMaintenance -= equipment.monthlyMaintenance;

        // הורדת הבונוסים
        Object.entries(equipment.benefits).forEach(([key, value]) => {
          if (key in state.totalBenefits) {
            state.totalBenefits[key as keyof typeof state.totalBenefits] -= value;
          }
        });
      }
    },

    updateEquipmentCondition: (state, action: PayloadAction<{ id: string; condition: number }>) => {
      const { id, condition } = action.payload;
      const equipment = state.ownedEquipment.find(e => e.id === id);
      if (equipment) {
        equipment.condition = Math.max(0, Math.min(100, condition));
      }
    },

    performMaintenance: (state, action: PayloadAction<string>) => {
      const equipmentId = action.payload;
      const equipment = state.ownedEquipment.find(e => e.id === equipmentId);
      if (equipment) {
        equipment.condition = 100;
      }
    },

    applyMonthlyDepreciation: (state) => {
      state.ownedEquipment.forEach(equipment => {
        if (equipment.condition) {
          equipment.condition = Math.max(0, equipment.condition - 5);
        }
      });
    }
  }
});

export const {
  purchaseEquipment,
  removeEquipment,
  updateEquipmentCondition,
  performMaintenance,
  applyMonthlyDepreciation
} = equipmentSlice.actions;

export default equipmentSlice.reducer; 