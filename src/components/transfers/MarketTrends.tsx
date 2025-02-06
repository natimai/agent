import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { MarketTrend } from '../../types/transfers';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Info as InfoIcon
} from '@mui/icons-material';

interface MarketTrendsProps {
  trends: MarketTrend[];
}

const MarketTrends: React.FC<MarketTrendsProps> = ({ trends }) => {
  const getTrendIcon = (priceChange: number) => {
    if (priceChange > 0) return <TrendingUp color="success" />;
    if (priceChange < 0) return <TrendingDown color="error" />;
    return <TrendingFlat color="info" />;
  };

  const getTrendColor = (priceChange: number) => {
    if (priceChange > 0) return 'success.main';
    if (priceChange < 0) return 'error.main';
    return 'info.main';
  };

  const getActivityLevel = (numberOfTransfers: number) => {
    if (numberOfTransfers > 20) return 'גבוהה';
    if (numberOfTransfers > 10) return 'בינונית';
    return 'נמוכה';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            מגמות שוק
          </Typography>
          <Tooltip title="הנתונים מתעדכנים כל שעה">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {trends.map((trend) => (
            <Grid item xs={12} key={trend.position}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {trend.position}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(trend.priceChange)}
                      <Typography 
                        variant="body2"
                        color={getTrendColor(trend.priceChange)}
                        fontWeight="bold"
                      >
                        {trend.priceChange > 0 ? '+' : ''}{trend.priceChange}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      מחיר ממוצע
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(trend.averagePrice)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        רמת פעילות
                      </Typography>
                      <Typography variant="body2">
                        {getActivityLevel(trend.numberOfTransfers)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((trend.numberOfTransfers / 30) * 100, 100)}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      label={`${trend.numberOfTransfers} העברות`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`עודכן: ${new Date(trend.timestamp).toLocaleDateString('he-IL')}`}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MarketTrends; 