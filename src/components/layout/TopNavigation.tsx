import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Chip,
  Button,
  Tooltip,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  EmojiEvents as TrophyIcon,
  AccountBalance as FinanceIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Assignment as MissionsIcon,
  CalendarToday as CalendarIcon,
  Euro as EuroIcon,
  CompareArrows as TransferIcon,
  ArrowForward as ArrowForwardIcon,
  AccountCircle as AccountCircleIcon,
  Today as TodayIcon,
  CalendarViewWeek as WeekIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { formatCurrency } from '../../utils/formatters';
import { GameState, GameEvent } from '../../types/game';
import { User } from '../../types/auth';
import { advanceDay, advanceWeek } from '../../store/slices/gameSlice';

interface AgentState {
  name: string;
  level: number;
  experience: number;
  reputation: number;
  skills: {
    negotiation: number;
    scouting: number;
    management: number;
    networking: number;
    leadership: number;
    analysis: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    rewardType: 'MONEY' | 'REPUTATION' | 'SKILL_POINTS';
    rewardAmount: number;
  }>;
  specializations: string[];
  badges: string[];
  statistics: {
    totalTransfers: number;
    successfulNegotiations: number;
    failedNegotiations: number;
    totalEarnings: number;
    discoveredTalents: number;
    completedMissions: number;
  };
}

interface TopNavigationProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const TopNavigation = ({ sidebarOpen, onSidebarToggle }: TopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [advanceMode, setAdvanceMode] = useState<'day' | 'week'>('week');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useSelector((state: RootState) => state.auth);
  const { balance } = useSelector((state: RootState) => state.finance);
  const { level, reputation } = useSelector((state: RootState) => state.agent as AgentState);
  const unreadNotifications = useSelector((state: RootState) => 
    (state.game as GameState).events.filter(event => !event.isHandled)
  );
  const { currentWeek, transferWindowOpen } = useSelector((state: RootState) => state.game);

  const menuItems = [
    { title: 'דשבורד', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'שחקנים', path: '/players', icon: <PeopleIcon /> },
    { title: 'סקאוטינג', path: '/scouting', icon: <SearchIcon /> },
    { title: 'משרד', path: '/office', icon: <BusinessIcon /> },
    { title: 'משימות', path: '/missions', icon: <MissionsIcon /> },
    { title: 'נכסים', path: '/assets', icon: <TrophyIcon /> },
    { title: 'פיננסים', path: '/finance', icon: <FinanceIcon /> }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getEventDescription = (event: GameEvent) => {
    return event.description;
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAdvanceModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'day' | 'week' | null
  ) => {
    if (newMode !== null) {
      setAdvanceMode(newMode);
    }
  };

  const handleAdvance = () => {
    if (advanceMode === 'day') {
      dispatch(advanceDay());
    } else {
      dispatch(advanceWeek());
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%',
          right: 0,
          left: 'auto',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="תפריט"
            onClick={onSidebarToggle}
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}>
              <Typography variant="body2" color="text.secondary">
                שבוע
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {currentWeek}
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}>
              <Typography variant="body2" color="text.secondary">
                תקציב
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(balance)}
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: transferWindowOpen ? theme.palette.success.light : theme.palette.error.light,
              color: transferWindowOpen ? theme.palette.success.contrastText : theme.palette.error.contrastText,
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}>
              <Typography variant="body2">
                חלון העברות {transferWindowOpen ? 'פתוח' : 'סגור'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2, mr: 2 }}>
            <ToggleButtonGroup
              value={advanceMode}
              exclusive
              onChange={handleAdvanceModeChange}
              size="small"
            >
              <ToggleButton value="day" aria-label="יום">
                <TodayIcon sx={{ fontSize: 20 }} />
              </ToggleButton>
              <ToggleButton value="week" aria-label="שבוע">
                <WeekIcon sx={{ fontSize: 20 }} />
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title={`התקדם ${advanceMode === 'day' ? 'יום' : 'שבוע'}`}>
              <Button
                variant="contained"
                color="primary"
                startIcon={advanceMode === 'day' ? <TodayIcon /> : <ArrowForwardIcon />}
                size="small"
                onClick={handleAdvance}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                התקדם {advanceMode === 'day' ? 'יום' : 'שבוע'}
              </Button>
            </Tooltip>
          </Box>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => {
          navigate('/profile');
          handleProfileMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="פרופיל" />
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/settings');
          handleProfileMenuClose();
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="הגדרות" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="התנתק" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={() => setNotificationsAnchor(null)}
      >
        {unreadNotifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="אין התראות חדשות" />
          </MenuItem>
        ) : (
          unreadNotifications.map((event) => (
            <MenuItem
              key={event.id}
              onClick={() => {
                setNotificationsAnchor(null);
              }}
            >
              <ListItemText
                primary={event.type}
                secondary={getEventDescription(event)}
              />
            </MenuItem>
          ))
        )}
      </Menu>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{ width: 64, height: 64, margin: '0 auto', mb: 1 }}
            >
              {user?.name?.charAt(0) || '?'}
            </Avatar>
            <Typography variant="h6">
              {user?.name || 'אורח'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              רמה {level}
            </Typography>
          </Box>

          <Divider />

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                button
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default TopNavigation; 