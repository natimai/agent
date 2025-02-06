import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  WorkspacePremium as BadgeIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

const AgentProfile: React.FC = () => {
  const agent = useSelector((state: RootState) => state.agent);

  const calculateLevelProgress = () => {
    const experienceNeeded = agent.level * 1000;
    return (agent.experience / experienceNeeded) * 100;
  };

  const getSkillColor = (level: number) => {
    if (level >= 80) return 'success';
    if (level >= 50) return 'primary';
    if (level >= 30) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* פרופיל ראשי */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    margin: '0 auto',
                    bgcolor: 'primary.main'
                  }}
                >
                  {agent.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {agent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  סוכן כדורגל
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  רמה {agent.level}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateLevelProgress()}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {agent.experience} / {agent.level * 1000} XP
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<StarIcon />}
                  label={`מוניטין: ${agent.reputation}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<TrophyIcon />}
                  label={`הישגים: ${agent.achievements.length}`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* כישורים */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                כישורים
              </Typography>
              
              {Object.entries(agent.skills).map(([skill, level]) => (
                <Box key={skill} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {skill}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {level}/100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={level}
                    color={getSkillColor(level)}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* סטטיסטיקות */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                סטטיסטיקות
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    העברות שהושלמו
                  </Typography>
                  <Typography variant="h4">
                    {agent.statistics.totalTransfers}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    הכנסות כוללות
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(agent.statistics.totalEarnings)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    אחוז הצלחה במו"מ
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(
                      (agent.statistics.successfulNegotiations /
                        (agent.statistics.successfulNegotiations + agent.statistics.failedNegotiations)) *
                        100 || 0
                    )}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* הישגים */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הישגים אחרונים
              </Typography>

              {agent.achievements.slice(-5).map((achievement) => (
                <Box key={achievement.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${achievement.rewardAmount} ${achievement.rewardType}`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {new Date(achievement.date).toLocaleDateString('he-IL')}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* התמחויות ותגים */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                התמחויות
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {agent.specializations.map((spec, index) => (
                  <Chip
                    key={index}
                    label={spec}
                    icon={<TimelineIcon />}
                    color="primary"
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                תגים
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {agent.badges.map((badge, index) => (
                  <Chip
                    key={index}
                    label={badge}
                    icon={<BadgeIcon />}
                    color="secondary"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentProfile; 