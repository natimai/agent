import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { RootState } from '../../types/store';
import { formatCurrency } from '../../utils/format';

const TopNavigation: React.FC = () => {
  const { balance } = useSelector((state: RootState) => state.finance);
  const { reputation } = useSelector((state: RootState) => state.game);

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          סוכן כדורגל
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            מוניטין: {reputation}
          </Typography>
          <Typography variant="body2">
            {formatCurrency(balance)}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation; 