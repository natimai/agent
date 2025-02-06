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
  Chip,
  LinearProgress
} from '@mui/material';
import { RootState } from '../../store';
import { Mission, MissionProgress } from '../../types/missions';
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
    id={`missions-tabpanel-${index}`}
    aria-labelledby={`missions-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const MissionsHub: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { 
    availableMissions,
    activeMissions,
    completedMissions,
    missionProgress,
    dailyChallenges,
    loading 
  } = useSelector((state: RootState) => state.missions);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const renderMissionCard = (mission: Mission) => {
    const progress = missionProgress.find(p => p.missionId === mission.id);
    const totalObjectives = mission.objectives.length;
    const completedObjectives = mission.objectives.filter(obj => obj.isCompleted).length;
    const progressPercentage = (completedObjectives / totalObjectives) * 100;

    return (
      <Grid item xs={12} md={6} key={mission.id}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">{mission.title}</Typography>
              <Chip
                label={mission.difficulty}
                color={
                  mission.difficulty === 'EASY' ? 'success' :
                  mission.difficulty === 'MEDIUM' ? 'warning' :
                  mission.difficulty === 'HARD' ? 'error' :
                  'default'
                }
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {mission.description}
            </Typography>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                התקדמות: {completedObjectives}/{totalObjectives} יעדים
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {mission.rewards.map((reward, index) => (
                <Chip
                  key={index}
                  label={`${reward.amount} ${reward.type}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>

            {mission.timeLimit && (
              <Typography variant="body2" color="error">
                זמן נותר: {Math.ceil(mission.timeLimit / (60 * 60))} שעות
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

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
        מרכז משימות
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="missions tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="משימות זמינות" />
        <Tab label="משימות פעילות" />
        <Tab label="משימות שהושלמו" />
        <Tab label="אתגרים יומיים" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {availableMissions.map(renderMissionCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          {activeMissions.map(renderMissionCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          {completedMissions.map(renderMissionCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Grid container spacing={3}>
          {dailyChallenges.map(challenge => (
            <Grid item xs={12} key={challenge.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{challenge.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {challenge.participantsCount} משתתפים
                    </Typography>
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    {challenge.description}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      טבלת מובילים:
                    </Typography>
                    {challenge.leaderboard.slice(0, 3).map((entry, index) => (
                      <Box
                        key={entry.agentId}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          bgcolor: index === 0 ? 'action.selected' : 'transparent',
                          borderRadius: 1
                        }}
                      >
                        <Typography>
                          {index + 1}. {entry.agentName}
                        </Typography>
                        <Typography>{entry.score} נקודות</Typography>
                      </Box>
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

export default MissionsHub; 