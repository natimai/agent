import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  EmojiEvents as TrophyIcon,
  AccountBalance as FinanceIcon,
  Assignment as MissionsIcon
} from '@mui/icons-material';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'דשבורד', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'שחקנים', path: '/players', icon: <PeopleIcon /> },
    { label: 'סקאוטינג', path: '/scouting', icon: <SearchIcon /> },
    { label: 'משרד', path: '/office', icon: <BusinessIcon /> },
    { label: 'משימות', path: '/missions', icon: <MissionsIcon /> }
  ];

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'none' } }} elevation={3}>
      <MuiBottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            value={item.path}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation; 