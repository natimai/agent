import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, 
  BottomNavigation as MuiBottomNavigation, 
  BottomNavigationAction,
  Box,
  Stack,
  Chip,
  useTheme,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PlayersIcon,
  Search as ScoutingIcon,
  EventNote as EventsIcon,
  Assignment as MissionsIcon,
  Today as TodayIcon,
  CalendarViewWeek as WeekIcon,
  CalendarToday as CalendarIcon,
  Euro as EuroIcon,
  CompareArrows as TransferIcon
} from '@mui/icons-material';
import { advanceDay, advanceWeek } from '../../store/slices/gameSlice';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { currentWeek, transferWindowOpen } = useSelector((state: RootState) => state.game);
  const { balance } = useSelector((state: RootState) => state.finance);

  const menuItems = [
    { path: '/', icon: <DashboardIcon />, label: 'ראשי' },
    { path: '/players', icon: <PlayersIcon />, label: 'שחקנים' },
    { path: '/scouting', icon: <ScoutingIcon />, label: 'סקאוטינג' },
    { path: '/events', icon: <EventsIcon />, label: 'אירועים' },
    { path: '/missions', icon: <MissionsIcon />, label: 'משימות' },
  ];

  const handleAdvanceDay = () => {
    dispatch(advanceDay());
  };

  const handleAdvanceWeek = () => {
    dispatch(advanceWeek());
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* הדר למובייל */}
      <Paper 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          py: 1,
          px: 2,
          display: { xs: 'block', sm: 'none' },
          height: 56,
          backgroundColor: 'background.paper'
        }}
        elevation={1}
      >
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Chip
            icon={<CalendarIcon />}
            label={`שבוע ${currentWeek}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<EuroIcon />}
            label={formatCurrency(balance)}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<TransferIcon />}
            label={transferWindowOpen ? 'חלון פתוח' : 'חלון סגור'}
            color={transferWindowOpen ? 'success' : 'default'}
            variant="outlined"
            size="small"
          />
        </Stack>
      </Paper>

      {/* תפריט תחתון */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          width: '100%',
          zIndex: 1000,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'background.paper',
          display: { xs: 'block', sm: 'none' }
        }} 
        elevation={3}
      >
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

      {/* כפתור התקדמות קפסולה - רק במובייל */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <ButtonGroup
          variant="contained"
          sx={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '24px',
            overflow: 'hidden',
            '& .MuiButton-root': {
              border: 'none',
              minWidth: '50px',
              px: 2,
              py: 1,
              fontSize: '0.75rem'
            },
            boxShadow: theme.shadows[4]
          }}
        >
          <Tooltip title="התקדם יום">
            <Button
              onClick={handleAdvanceDay}
              startIcon={<TodayIcon />}
              sx={{
                borderRadius: '24px 0 0 24px',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              יום
            </Button>
          </Tooltip>
          <Tooltip title="התקדם שבוע">
            <Button
              onClick={handleAdvanceWeek}
              startIcon={<WeekIcon />}
              sx={{
                borderRadius: '0 24px 24px 0',
                backgroundColor: theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              שבוע
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default BottomNavigation; 