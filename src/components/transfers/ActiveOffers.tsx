import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { TransferOffer } from '../../types/transfers';
import { Player } from '../../types/player';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

interface ActiveOffersProps {
  offers: TransferOffer[];
  onStartNegotiation: (offer: TransferOffer, player: Player) => void;
}

const ActiveOffers: React.FC<ActiveOffersProps> = ({ offers, onStartNegotiation }) => {
  const players = useSelector((state: RootState) => state.players.players);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          הצעות פעילות
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {offers.length} הצעות פעילות
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {offers.map((offer) => {
            const player = players.find(p => p.id === offer.playerId);
            if (!player) return null;

            return (
              <Card key={offer.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        {player.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.position} • גיל {player.age}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {formatCurrency(offer.currentOffer)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onStartNegotiation(offer, player)}
                    >
                      התחל מו"מ
                    </Button>
                  </Box>

                  {/* תנאים */}
                  {offer.conditions.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        תנאים:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        {offer.conditions.map((condition, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            {condition.description}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* מידע נוסף */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      עמלת סוכן: {offer.agentFeePercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      השפעה על מוניטין: {offer.reputationImpact > 0 ? '+' : ''}{offer.reputationImpact}
                    </Typography>
                  </Box>

                  {/* תאריך תפוגה */}
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    תוקף עד: {new Date(offer.expiresAt).toLocaleDateString('he-IL')}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActiveOffers; 