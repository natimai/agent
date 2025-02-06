import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
import ActiveOffers from './ActiveOffers';
import TransferHistory from './TransferHistory';
import MarketTrends from './MarketTrends';
import { TransferAnalyticsView } from './TransferAnalytics';
import { RootState } from '../../store';
import { TransferOffer } from '../../types/transfers';
import { Player } from '../../types/player';
import { FiSearch, FiPlus } from 'react-icons/fi';
import NegotiationDialog from './NegotiationDialog';
import PlayerSearch from './PlayerSearch';

export const TransfersHub: React.FC = () => {
  const [selectedOffer, setSelectedOffer] = useState<TransferOffer | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { activeOffers, completedTransfers, marketTrends } = useSelector((state: RootState) => state.transfers.market);

  const handleStartNegotiation = (offer: TransferOffer, player: Player) => {
    setSelectedOffer(offer);
    setSelectedPlayer(player);
  };

  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        מרכז העברות
      </Typography>

      <Grid container spacing={3}>
        {/* הצעות פעילות */}
        <Grid item xs={12} md={6}>
          <ActiveOffers
            offers={activeOffers}
            onStartNegotiation={handleStartNegotiation}
          />
        </Grid>

        {/* אנליטיקס */}
        <Grid item xs={12} md={6}>
          {selectedOffer && selectedPlayer && (
            <TransferAnalyticsView
              player={selectedPlayer}
              offer={selectedOffer}
            />
          )}
        </Grid>

        {/* מגמות שוק */}
        <Grid item xs={12} md={6}>
          <MarketTrends trends={marketTrends} />
        </Grid>

        {/* היסטוריית העברות */}
        <Grid item xs={12} md={6}>
          <TransferHistory transfers={completedTransfers} />
        </Grid>
      </Grid>

      {selectedOffer && (
        <NegotiationDialog
          offer={selectedOffer}
          isOpen={isNegotiationOpen}
          onClose={() => {
            setIsNegotiationOpen(false);
            setSelectedOffer(null);
          }}
        />
      )}

      <PlayerSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </Box>
  );
};

export default TransfersHub; 