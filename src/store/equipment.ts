import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentItem } from '../types/reputation';

interface EquipmentState {
  purchasedItems: {
    [key: string]: {
      item: EquipmentItem;
      purchaseDate: string;
      condition: number;
    }
  };
  monthlyMaintenance: number;
}

const initialState: EquipmentState = {
  purchasedItems: {},
  monthlyMaintenance: 0
};

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    purchase: (state, action: PayloadAction<EquipmentItem>) => {
      const item = action.payload;
      state.purchasedItems[item.id] = {
        item,
        purchaseDate: new Date().toISOString(),
        condition: 100
      };
      state.monthlyMaintenance += item.monthlyMaintenance;
    },
    
    updateCondition: (state, action: PayloadAction<{ itemId: string; condition: number }>) => {
      const { itemId, condition } = action.payload;
      if (state.purchasedItems[itemId]) {
        state.purchasedItems[itemId].condition = Math.max(0, Math.min(100, condition));
      }
    },
    
    remove: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (state.purchasedItems[itemId]) {
        state.monthlyMaintenance -= state.purchasedItems[itemId].item.monthlyMaintenance;
        delete state.purchasedItems[itemId];
      }
    },

    applyMonthlyMaintenance: (state) => {
      Object.keys(state.purchasedItems).forEach(itemId => {
        const item = state.purchasedItems[itemId];
        // הפחתת מצב הציוד ב-5% כל חודש
        item.condition = Math.max(0, item.condition - 5);
      });
    }
  }
});

export const { purchase, updateCondition, remove, applyMonthlyMaintenance } = equipmentSlice.actions;
export default equipmentSlice.reducer; 