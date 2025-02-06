import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PlayersIcon,
  Search as ScoutingIcon,
  EventNote as EventsIcon,
  Assignment as MissionsIcon,
  AccountBalance as FinanceIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <DashboardIcon />, text: 'ראשי' },
    { path: '/players', icon: <PlayersIcon />, text: 'שחקנים' },
    { path: '/scouting', icon: <ScoutingIcon />, text: 'סקאוטינג' },
    { path: '/events', icon: <EventsIcon />, text: 'אירועים' },
    { path: '/missions', icon: <MissionsIcon />, text: 'משימות' },
    { path: '/finance', icon: <FinanceIcon />, text: 'פיננסים' },
    { path: '/settings', icon: <SettingsIcon />, text: 'הגדרות' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center'
      }}>
        {open && (
          <Typography variant="h6" noWrap>
            סוכן כדורגל
          </Typography>
        )}
        <IconButton onClick={onToggle}>
          {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '30',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.primary.main + '10',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      open={open}
      sx={{
        width: open ? 240 : 65,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 65,
          overflowX: 'hidden',
          borderLeft: 'none',
          borderRight: `1px solid ${theme.palette.divider}`,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 