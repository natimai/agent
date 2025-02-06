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
  LinearProgress,
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
    id={`finance-tabpanel-${index}`}
    aria-labelledby={`finance-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Finance: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { budget, monthlyIncome, monthlyExpenses, transactions } = useSelector(
    (state: RootState) => state.finance
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const calculateMonthlyBalance = () => {
    return monthlyIncome - monthlyExpenses;
  };

  const calculateIncomeProgress = () => {
    const target = monthlyExpenses * 2; // יעד: הכנסה כפולה מההוצאות
    return Math.min((monthlyIncome / target) * 100, 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        פיננסים
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                תקציב נוכחי
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(budget)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הכנסה חודשית
              </Typography>
              <Typography variant="h4" color="success">
                {formatCurrency(monthlyIncome)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateIncomeProgress()} 
                  color="success"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
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
                {formatCurrency(monthlyExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                מאזן חודשי
              </Typography>
              <Typography 
                variant="h4" 
                color={calculateMonthlyBalance() >= 0 ? 'success' : 'error'}
              >
                {formatCurrency(calculateMonthlyBalance())}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="finance tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="תנועות" />
        <Tab label="תקציב" />
        <Tab label="דוחות" />
        <Tab label="הלוואות" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        {/* תצוגת תנועות */}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* תצוגת תקציב */}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* תצוגת דוחות */}
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        {/* תצוגת הלוואות */}
      </TabPanel>
    </Box>
  );
};

export default Finance; 