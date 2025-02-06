import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from '../../types/assets';

interface AssetsState {
  ownedAssets: Asset[];
  totalMaintenance: number;
  totalValue: number;
  reputationBonus: number;
}

const initialState: AssetsState = {
  ownedAssets: [],
  totalMaintenance: 0,
  totalValue: 0,
  reputationBonus: 0
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    purchaseAsset: (state, action: PayloadAction<Asset>) => {
      const asset = action.payload;
      state.ownedAssets.push({
        ...asset,
        purchaseDate: new Date().toISOString(),
        condition: 100
      });
      state.totalMaintenance += asset.monthlyMaintenance;
      state.totalValue += asset.cost;
      state.reputationBonus += asset.reputationBonus;
    },

    sellAsset: (state, action: PayloadAction<string>) => {
      const assetId = action.payload;
      const asset = state.ownedAssets.find(a => a.id === assetId);
      if (asset) {
        state.ownedAssets = state.ownedAssets.filter(a => a.id !== assetId);
        state.totalMaintenance -= asset.monthlyMaintenance;
        state.totalValue -= asset.cost;
        state.reputationBonus -= asset.reputationBonus;
      }
    },

    updateAssetCondition: (state, action: PayloadAction<{ id: string; condition: number }>) => {
      const { id, condition } = action.payload;
      const asset = state.ownedAssets.find(a => a.id === id);
      if (asset) {
        asset.condition = Math.max(0, Math.min(100, condition));
      }
    },

    performMaintenance: (state, action: PayloadAction<string>) => {
      const assetId = action.payload;
      const asset = state.ownedAssets.find(a => a.id === assetId);
      if (asset && asset.condition) {
        asset.condition = 100;
      }
    },

    applyMonthlyDepreciation: (state) => {
      state.ownedAssets.forEach(asset => {
        if (asset.condition) {
          asset.condition = Math.max(0, asset.condition - 5);
        }
      });
    }
  }
});

export const {
  purchaseAsset,
  sellAsset,
  updateAssetCondition,
  performMaintenance,
  applyMonthlyDepreciation
} = assetsSlice.actions;

export default assetsSlice.reducer; 