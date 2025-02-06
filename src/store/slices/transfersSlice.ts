import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransferMarket, TransferOffer, CompletedTransfer, MarketTrend } from '../../types/transfers';

interface TransfersState {
  market: TransferMarket;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransfersState = {
  market: {
    activeOffers: [],
    completedTransfers: [],
    marketTrends: [],
    negotiations: []
  },
  isLoading: false,
  error: null
};

const transfersSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    addOffer: (state, action: PayloadAction<TransferOffer>) => {
      state.market.activeOffers.push(action.payload);
    },
    updateOffer: (state, action: PayloadAction<Partial<TransferOffer> & { id: string }>) => {
      const offer = state.market.activeOffers.find(o => o.id === action.payload.id);
      if (offer) {
        Object.assign(offer, action.payload);
      }
    },
    completeTransfer: (state, action: PayloadAction<CompletedTransfer>) => {
      // מחיקת ההצעה הפעילה
      state.market.activeOffers = state.market.activeOffers.filter(
        o => o.playerId !== action.payload.playerId
      );
      // הוספה להעברות שהושלמו
      state.market.completedTransfers.push(action.payload);
    },
    updateMarketTrends: (state, action: PayloadAction<MarketTrend[]>) => {
      state.market.marketTrends = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateTransferOffer: (state, action: PayloadAction<TransferOffer>) => {
      const index = state.market.activeOffers.findIndex(
        offer => offer.id === action.payload.id
      );
      
      if (index !== -1) {
        state.market.activeOffers[index] = action.payload;
      }
    }
  }
});

export const { 
  addOffer, 
  updateOffer, 
  completeTransfer, 
  updateMarketTrends,
  setLoading,
  setError,
  updateTransferOffer
} = transfersSlice.actions;

export default transfersSlice.reducer; 