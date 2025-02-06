import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`assets-tabpanel-${index}`}
    aria-labelledby={`assets-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Assets: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { ownedAssets, totalMaintenance, totalValue, reputationBonus } = useSelector(
    (state: RootState) => state.assets
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        נכסים
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                שווי כולל
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הוצאות חודשיות
              </Typography>
              <Typography variant="h4" color="error">
                {formatCurrency(totalMaintenance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                בונוס מוניטין
              </Typography>
              <Typography variant="h4" color="success">
                +{reputationBonus}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                נכסים בבעלות
              </Typography>
              <Typography variant="h4">
                {ownedAssets.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="assets tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="נכסים" />
        <Tab label="רכבים" />
        <Tab label="פריטי יוקרה" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        {/* תצוגת נכסים */}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* תצוגת רכבים */}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* תצוגת פריטי יוקרה */}
      </TabPanel>
    </Box>
  );
};

export default Assets; 