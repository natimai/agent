import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransferMarket, TransferOffer, CompletedTransfer, MarketTrend } from '../../types/transfers';
import { RootState } from '../store';

const initialState: TransferMarket = {
  activeOffers: [],
  completedTransfers: [],
  marketTrends: [],
  negotiations: []
};

const transfersSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    addTransferOffer: (state, action: PayloadAction<TransferOffer>) => {
      state.activeOffers.push(action.payload);
    },
    updateTransferOffer: (state, action: PayloadAction<{ id: string; changes: Partial<TransferOffer> }>) => {
      const { id, changes } = action.payload;
      const offer = state.activeOffers.find(o => o.id === id);
      if (offer) {
        Object.assign(offer, changes);
      }
    },
    addCompletedTransfer: (state, action: PayloadAction<CompletedTransfer>) => {
      state.completedTransfers.push(action.payload);
      state.activeOffers = state.activeOffers.filter(
        offer => offer.id !== action.payload.id
      );
    },
    updateMarketTrends: (state, action: PayloadAction<MarketTrend[]>) => {
      state.marketTrends = action.payload;
    },
    removeTransferOffer: (state, action: PayloadAction<string>) => {
      state.activeOffers = state.activeOffers.filter(
        offer => offer.id !== action.payload
      );
    }
  }
});

export const {
  addTransferOffer,
  updateTransferOffer,
  addCompletedTransfer,
  updateMarketTrends,
  removeTransferOffer
} = transfersSlice.actions;

export const selectTransfers = (state: RootState) => state.transfers;
export const selectActiveOffers = (state: RootState) => state.transfers.activeOffers;
export const selectCompletedTransfers = (state: RootState) => state.transfers.completedTransfers;
export const selectMarketTrends = (state: RootState) => state.transfers.marketTrends;

export default transfersSlice.reducer; 