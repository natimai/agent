import React from 'react';
import { Box, Card, CardContent, Typography, Chip, List, ListItem, ListItemText } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { TransferOffer } from '../../types/transfers';
import { Player } from '../../types/player';
import { getTransferAnalysis } from '../../services/transferAnalytics';
import { formatCurrency } from '../../utils/formatters';

interface TransferAnalyticsProps {
  player: Player;
  offer: TransferOffer;
}

const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
  switch (trend) {
    case 'UP':
      return <TrendingUp color="success" />;
    case 'DOWN':
      return <TrendingDown color="error" />;
    case 'STABLE':
      return <TrendingFlat color="info" />;
  }
};

export const TransferAnalyticsView: React.FC<TransferAnalyticsProps> = ({ player, offer }) => {
  const analysis = getTransferAnalysis(player, offer);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ניתוח העברה
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {/* מחיר מומלץ */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              מחיר מומלץ
            </Typography>
            <Typography variant="h5">
              {formatCurrency(analysis.recommendedPrice)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              טווח: {formatCurrency(analysis.priceRange.min)} - {formatCurrency(analysis.priceRange.max)}
            </Typography>
          </Box>

          {/* מגמת שוק */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              מגמת שוק
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTrendIcon(analysis.marketTrend)}
              <Typography>
                {analysis.marketTrend === 'UP' && 'עולה'}
                {analysis.marketTrend === 'DOWN' && 'יורד'}
                {analysis.marketTrend === 'STABLE' && 'יציב'}
              </Typography>
            </Box>
          </Box>

          {/* סיכויי הצלחה */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              סיכויי הצלחה
            </Typography>
            <Typography variant="h5">
              {Math.round(analysis.successProbability)}%
            </Typography>
          </Box>
        </Box>

        {/* עסקאות דומות */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            עסקאות דומות
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {analysis.similarDeals.map((deal) => (
              <Chip
                key={deal.id}
                label={formatCurrency(deal.amount)}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* המלצות */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            המלצות
          </Typography>
          <List dense>
            {analysis.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}; 