import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  AccountBalance as FinanceIcon,
  Assignment as MissionsIcon
} from '@mui/icons-material';
import { RootState } from '../store';
import { formatCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { level, reputation, experience } = useSelector((state: RootState) => state.agent);
  const { balance, monthlyIncome, monthlyExpenses } = useSelector((state: RootState) => state.finance);
  const { players } = useSelector((state: RootState) => state.players);
  const { activeMissions } = useSelector((state: RootState) => state.missions);

  const experienceToNextLevel = 1000; // יש להחליף בלוגיקה אמיתית
  const experienceProgress = (experience % experienceToNextLevel) / experienceToNextLevel * 100;

  const totalPlayersValue = players.reduce((sum, player) => sum + player.value, 0);
  const averagePlayerValue = players.length > 0 ? totalPlayersValue / players.length : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* פרופיל הסוכן */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {user?.username.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {user?.username}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<StarIcon />}
                      label={`רמה ${level}`}
                      color="primary"
                    />
                    <Chip
                      icon={<TrophyIcon />}
                      label={`מוניטין ${reputation}`}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    התקדמות לרמה הבאה
                  </Typography>
                  <Typography variant="body2">
                    {Math.floor(experience % experienceToNextLevel)}/{experienceToNextLevel}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={experienceProgress}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ mr: 1 }} color="primary" />
                <Typography color="text.secondary">
                  שחקנים
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {players.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                שווי ממוצע: {formatCurrency(averagePlayerValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FinanceIcon sx={{ mr: 1 }} color="success" />
                <Typography color="text.secondary">
                  מאזן
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {formatCurrency(balance)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(monthlyIncome)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="error.main">
                    {formatCurrency(monthlyExpenses)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MissionsIcon sx={{ mr: 1 }} color="info" />
                <Typography color="text.secondary">
                  משימות פעילות
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {activeMissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeMissions.length > 0 
                  ? `${activeMissions[0].title} בתהליך...`
                  : 'אין משימות פעילות'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrophyIcon sx={{ mr: 1 }} color="warning" />
                <Typography color="text.secondary">
                  הישגים
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 הישגים חדשים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* שחקנים מובילים */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            שחקנים מובילים
          </Typography>
          <Grid container spacing={2}>
            {players
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((player, index) => (
                <Grid item xs={12} md={4} key={player.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={player.image}
                          sx={{ 
                            width: 60, 
                            height: 60,
                            mr: 2
                          }}
                        >
                          {!player.image && player.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {player.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {player.position.main}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          שווי שוק
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(player.value)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          פוטנציאל
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                          {Array.from({ length: Math.floor(player.potential / 20) }).map((_, i) => (
                            <StarIcon key={i} sx={{ color: 'warning.main' }} />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 