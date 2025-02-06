import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Button,
  Tooltip,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  ContactMail as ContactsIcon,
  Event as EventIcon,
  Assignment as MissionIcon,
  AccountBalance as AssetsIcon,
  MonetizationOn as FinanceIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  PlayArrow as PlayArrowIcon,
  CalendarToday as CalendarIcon,
  Euro as EuroIcon,
  SwapHoriz as TransferIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { formatCurrency } from '../utils/formatters';
import { advanceWeek } from '../store/slices/gameSlice';
import { processMonthlyFinances } from '../store/slices/financeSlice';
import TopNavigation from './layout/TopNavigation';
import BottomNavigation from './layout/BottomNavigation';
import Sidebar from './layout/Sidebar';
import { ToastContainer } from './common/Toast';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { text: 'לוח בקרה', path: '/', icon: <DashboardIcon /> },
  { text: 'שחקנים', path: '/players', icon: <PeopleIcon /> },
  { text: 'סקאוטינג', path: '/scouting', icon: <SearchIcon /> },
  { text: 'משרד', path: '/office', icon: <BusinessIcon /> },
  { text: 'אנשי קשר', path: '/contacts', icon: <ContactsIcon /> },
  { text: 'אירועים', path: '/events', icon: <EventIcon /> },
  { text: 'משימות', path: '/missions', icon: <MissionIcon /> },
  { text: 'נכסים', path: '/assets', icon: <AssetsIcon /> },
  { text: 'פיננסים', path: '/finance', icon: <AssetsIcon /> },
  { text: 'הגדרות', path: '/settings', icon: <SettingsIcon /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { balance } = useSelector((state: RootState) => state.finance);
  const { currentWeek, transferWindowOpen } = useSelector((state: RootState) => state.game);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAdvanceWeek = () => {
    dispatch(advanceWeek());
    if (currentWeek % 4 === 0) {
      dispatch(processMonthlyFinances());
    }
  };

  if (!user || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isMobile && <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          pt: { xs: '112px', sm: '64px' },
          pb: { xs: '128px', sm: '24px' },
          px: { xs: 2, sm: 3 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && !isMobile && {
            marginRight: '240px',
            width: `calc(100% - 240px)`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <TopNavigation sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
        
        <Box sx={{ 
          maxWidth: { sm: '100%', md: '1200px' },
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          borderRadius: 2,
        }}>
          {children}
        </Box>

        {isMobile && <BottomNavigation />}
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default Layout; 