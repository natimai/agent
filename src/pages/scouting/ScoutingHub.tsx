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
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { Scout, ScoutingMission } from '../../types/scouting';
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
    id={`scouting-tabpanel-${index}`}
    aria-labelledby={`scouting-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ScoutingHub: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { scouts, missions, reports, loading } = useSelector((state: RootState) => state.scouting);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const renderScoutCard = (scout: Scout) => (
    <Grid item xs={12} md={4} key={scout.id}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{scout.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                רמה {scout.level}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={scout.specialization} 
              size="small" 
              color="primary"
              sx={{ mr: 1 }}
            />
            {scout.currentMission && (
              <Chip
                label="במשימה"
                size="small"
                color="warning"
              />
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              סטטיסטיקות
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  משימות מוצלחות: {scout.stats.successfulMissions}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  שחקנים שהתגלו: {scout.stats.playersDiscovered}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" color="text.secondary">
            שכר: {formatCurrency(scout.salary)} / חודש
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderMissionCard = (mission: ScoutingMission) => (
    <Grid item xs={12} md={4} key={mission.id}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {mission.title}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip
              label={mission.status}
              size="small"
              color={
                mission.status === 'completed' ? 'success' :
                mission.status === 'failed' ? 'error' :
                mission.status === 'in_progress' ? 'warning' :
                'default'
              }
              sx={{ mr: 1 }}
            />
            <Chip
              label={mission.priority}
              size="small"
              color={
                mission.priority === 'high' ? 'error' :
                mission.priority === 'medium' ? 'warning' :
                'default'
              }
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {mission.description}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              תקציב: {formatCurrency(mission.budget)}
            </Typography>
            <Typography variant="body2">
              משך: {mission.duration} ימים
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        מרכז סקאוטינג
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="scouting tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="סקירה כללית" />
        <Tab label="סקאוטים" />
        <Tab label="משימות" />
        <Tab label="דוחות" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  סטטיסטיקות סקאוטינג
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">סקאוטים פעילים</Typography>
                    <Typography variant="h4">{scouts.length}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">משימות פעילות</Typography>
                    <Typography variant="h4">
                      {missions.filter(m => m.status === 'in_progress').length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">דוחות החודש</Typography>
                    <Typography variant="h4">
                      {reports.filter(r => {
                        const reportDate = new Date(r.date);
                        const now = new Date();
                        return reportDate.getMonth() === now.getMonth() &&
                               reportDate.getFullYear() === now.getFullYear();
                      }).length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">אחוז הצלחה</Typography>
                    <Typography variant="h4">
                      {missions.length > 0
                        ? Math.round(
                            (missions.filter(m => m.status === 'completed').length /
                              missions.length) *
                              100
                          )
                        : 0}
                      %
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  משימות פעילות
                </Typography>
                {missions
                  .filter(m => m.status === 'in_progress')
                  .slice(0, 3)
                  .map(mission => (
                    <Box key={mission.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">{mission.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mission.description}
                      </Typography>
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          {scouts.map(renderScoutCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          {missions.map(renderMissionCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Grid container spacing={3}>
          {reports.map(report => (
            <Grid item xs={12} md={6} key={report.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {report.content.summary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    תאריך: {new Date(report.date).toLocaleDateString('he-IL')}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={report.status}
                      size="small"
                      color={
                        report.status === 'approved' ? 'success' :
                        report.status === 'rejected' ? 'error' :
                        'default'
                      }
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      חוזקות:
                    </Typography>
                    {report.content.strengths.map((strength, index) => (
                      <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                        • {strength}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default ScoutingHub; 