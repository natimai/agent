import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star as StarIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { startMission, failMission } from '../../store/slices/missionsSlice';
import { Mission, MissionProgress, DailyChallenge } from '../../types/missions';
import { formatCurrency } from '../../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const MissionsHub: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showMissionDetails, setShowMissionDetails] = useState(false);

  const {
    availableMissions,
    activeMissions,
    completedMissions,
    missionProgress,
    dailyChallenges
  } = useSelector((state: RootState) => state.missions);

  const { level, reputation } = useSelector((state: RootState) => state.agent);

  useEffect(() => {
    // בדיקת משימות שפג תוקפן
    const checkExpiredMissions = () => {
      activeMissions.forEach(mission => {
        if (mission.timeLimit && mission.startDate) {
          const startTime = new Date(mission.startDate).getTime();
          const currentTime = new Date().getTime();
          const timePassed = (currentTime - startTime) / 1000;

          if (timePassed > mission.timeLimit) {
            dispatch(failMission(mission.id));
          }
        }
      });
    };

    const timer = setInterval(checkExpiredMissions, 60000); // בדיקה כל דקה
    return () => clearInterval(timer);
  }, [activeMissions, dispatch]);

  const handleStartMission = (mission: Mission) => {
    // בדיקת דרישות
    const meetsRequirements = mission.requirements.every(req => {
      switch (req.type) {
        case 'LEVEL':
          return level >= req.value;
        case 'REPUTATION':
          return reputation >= req.value;
        // הוסף בדיקות נוספות לפי הצורך
        default:
          return true;
      }
    });

    if (meetsRequirements) {
      dispatch(startMission(mission.id));
    }
  };

  const getMissionProgress = (missionId: string): MissionProgress | undefined => {
    return missionProgress.find(mp => mp.missionId === missionId);
  };

  const renderMissionCard = (mission: Mission) => {
    const progress = getMissionProgress(mission.id);
    const totalProgress = progress ? 
      mission.objectives.reduce((sum, obj) => 
        sum + (progress.objectiveProgress[obj.id] || 0) / obj.targetProgress, 0
      ) / mission.objectives.length * 100 : 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card 
          sx={{ 
            mb: 2,
            cursor: 'pointer',
            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
          }}
          onClick={() => {
            setSelectedMission(mission);
            setShowMissionDetails(true);
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6">
                {mission.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {mission.difficulty === 'HARD' && (
                  <Tooltip title="משימה קשה">
                    <StarIcon color="warning" />
                  </Tooltip>
                )}
                {mission.timeLimit && (
                  <Tooltip title={`${mission.timeLimit / 3600} שעות להשלמה`}>
                    <TimerIcon color="info" />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {mission.description}
            </Typography>

            {progress && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    התקדמות
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(totalProgress)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={totalProgress}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mission.rewards.map((reward, index) => (
                <Chip
                  key={index}
                  label={`${reward.amount} ${reward.type}`}
                  size="small"
                  icon={<TrophyIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="משימות זמינות" />
          <Tab label="משימות פעילות" />
          <Tab label="אתגר יומי" />
          <Tab label="משימות שהושלמו" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {availableMissions.map(mission => (
            <Grid item xs={12} md={6} key={mission.id}>
              {renderMissionCard(mission)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Grid container spacing={3}>
          {activeMissions.map(mission => (
            <Grid item xs={12} md={6} key={mission.id}>
              {renderMissionCard(mission)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          {dailyChallenges.map(challenge => (
            <Grid item xs={12} key={challenge.id}>
              {renderMissionCard(challenge)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Grid container spacing={3}>
          {completedMissions.map(mission => (
            <Grid item xs={12} md={6} key={mission.id}>
              {renderMissionCard(mission)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* דיאלוג פרטי משימה */}
      <Dialog
        open={showMissionDetails}
        onClose={() => setShowMissionDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedMission && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedMission.title}
                <IconButton onClick={() => setShowMissionDetails(false)}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedMission.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                יעדים
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedMission.objectives.map(objective => {
                  const progress = getMissionProgress(selectedMission.id);
                  const currentProgress = progress ? progress.objectiveProgress[objective.id] || 0 : 0;
                  const percentage = (currentProgress / objective.targetProgress) * 100;

                  return (
                    <Box key={objective.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          {objective.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentProgress}/{objective.targetProgress}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  );
                })}
              </Box>

              {selectedMission.bonusObjectives && (
                <>
                  <Typography variant="h6" gutterBottom>
                    יעדי בונוס
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedMission.bonusObjectives.map(objective => (
                      <Box key={objective.id} sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          {objective.description}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={0}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              <Typography variant="h6" gutterBottom>
                פרסים
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {selectedMission.rewards.map((reward, index) => (
                  <Chip
                    key={index}
                    label={`${reward.amount} ${reward.type}`}
                    icon={<TrophyIcon />}
                    color="primary"
                  />
                ))}
              </Box>

              {selectedMission.bonusRewards && (
                <>
                  <Typography variant="h6" gutterBottom>
                    פרסי בונוס
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedMission.bonusRewards.map((reward, index) => (
                      <Chip
                        key={index}
                        label={`${reward.amount} ${reward.type}`}
                        icon={<StarIcon />}
                        color="secondary"
                      />
                    ))}
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {selectedMission.status === 'AVAILABLE' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleStartMission(selectedMission);
                    setShowMissionDetails(false);
                  }}
                >
                  התחל משימה
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MissionsHub; 