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
  Button,
  Divider
} from '@mui/material';
import { RootState } from '../../store';
import PurchasedEquipment from '../../components/office/PurchasedEquipment';
import EquipmentStore from '../../components/office/EquipmentStore';
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
    id={`office-tabpanel-${index}`}
    aria-labelledby={`office-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Office: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { totalMaintenance, totalBenefits } = useSelector((state: RootState) => state.equipment);
  const { budget } = useSelector((state: RootState) => state.finance);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        משרד
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                תקציב זמין
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(Number(budget))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                בונוסים פעילים
              </Typography>
              <Box>
                {Object.entries(totalBenefits).map(([key, value]) => (
                  value > 0 && (
                    <Typography key={key} variant="body2" color="text.secondary">
                      {key}: +{value}%
                    </Typography>
                  )
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="office tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="ציוד קיים" />
        <Tab label="חנות ציוד" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <PurchasedEquipment />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <EquipmentStore />
      </TabPanel>
    </Box>
  );
};

export default Office; 