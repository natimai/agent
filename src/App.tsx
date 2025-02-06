import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Toaster } from 'react-hot-toast';

import theme from './theme';
import TopNavigation from './components/layout/TopNavigation';
import Dashboard from './pages/dashboard/Dashboard';
import PlayersList from './pages/players/PlayersList';
import PlayerProfile from './pages/players/PlayerProfile';
import ScoutingHub from './pages/scouting/ScoutingHub';
import Office from './pages/office/Office';
import Contacts from './pages/contacts/Contacts';
import Events from './pages/events/Events';
import MissionsHub from './pages/missions/MissionsHub';
import Assets from './pages/assets/Assets';
import Finance from './pages/finance/Finance';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/Layout';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const App: React.FC = () => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/players" element={<PrivateRoute><PlayersList /></PrivateRoute>} />
                    <Route path="/players/:id" element={<PlayerProfile />} />
                    <Route path="/scouting" element={<ScoutingHub />} />
                    <Route path="/office" element={<Office />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/missions" element={<MissionsHub />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/finance" element={<PrivateRoute><Finance /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
          <Toaster position="bottom-left" />
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App; 