import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  SportsSoccer as SoccerIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';

// צבעים של כדורגל
const soccerColors = {
  grassGreen: '#2E7D32',
  fieldWhite: '#FFFFFF',
  ballBlack: '#212121',
  goalRed: '#D32F2F',
  refereeYellow: '#FFC107',
  stadiumGrey: '#424242',
  skyBlue: '#1976D2'
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { 
    players,
    loading: playersLoading 
  } = useSelector((state: RootState) => state.players);
  
  const { 
    budget,
    monthlyIncome,
    monthlyExpenses,
    loading: financeLoading 
  } = useSelector((state: RootState) => state.finance);
  
  const { 
    activeMissions = [],
    loading: missionsLoading 
  } = useSelector((state: RootState) => state.missions || { activeMissions: [] });
  
  const { 
    events = [],
    loading: eventsLoading 
  } = useSelector((state: RootState) => state.events || { events: [] });

  const topPlayers = [...players]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const upcomingEvents = [...events]
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  if (playersLoading || financeLoading || missionsLoading || eventsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ 
          backgroundColor: soccerColors.fieldWhite,
          '& .MuiLinearProgress-bar': {
            backgroundColor: soccerColors.grassGreen
          }
        }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* כותרת */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${soccerColors.grassGreen}, ${soccerColors.skyBlue})`,
          color: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <SoccerIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
          <Typography variant={isMobile ? 'h5' : 'h4'}>
            לוח בקרה
          </Typography>
        </Box>
      </Paper>

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 1 : 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${soccerColors.skyBlue}, ${soccerColors.grassGreen})`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                <Typography variant={isMobile ? 'subtitle1' : 'h6'}>תקציב</Typography>
              </Box>
              <Typography variant={isMobile ? 'h6' : 'h4'} sx={{ mb: 1 }}>
                {formatCurrency(budget)}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                {monthlyIncome > monthlyExpenses ? (
                  <>
                    <TrendingUpIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                    <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ ml: 0.5 }}>
                      {formatCurrency(monthlyIncome - monthlyExpenses)} רווח חודשי
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                    <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ ml: 0.5 }}>
                      {formatCurrency(monthlyExpenses - monthlyIncome)} הפסד חודשי
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${soccerColors.refereeYellow}, ${soccerColors.goalRed})`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                <Typography variant={isMobile ? 'subtitle1' : 'h6'}>שחקנים</Typography>
              </Box>
              <Typography variant={isMobile ? 'h6' : 'h4'} sx={{ mb: 1 }}>
                {players.length}
              </Typography>
              <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                שווי כולל: {formatCurrency(players.reduce((sum, player) => sum + player.value, 0))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${soccerColors.grassGreen}, ${soccerColors.skyBlue})`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                <Typography variant={isMobile ? 'subtitle1' : 'h6'}>משימות</Typography>
              </Box>
              <Typography variant={isMobile ? 'h6' : 'h4'} sx={{ mb: 1 }}>
                {activeMissions.length}
              </Typography>
              <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                {activeMissions.filter(m => m.isImportant).length} משימות חשובות
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${soccerColors.skyBlue}, ${soccerColors.refereeYellow})`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                <Typography variant={isMobile ? 'subtitle1' : 'h6'}>אירועים</Typography>
              </Box>
              <Typography variant={isMobile ? 'h6' : 'h4'} sx={{ mb: 1 }}>
                {upcomingEvents.length}
              </Typography>
              <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                {upcomingEvents.filter(e => e.isImportant).length} אירועים חשובים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* שחקנים מובילים */}
      <Paper sx={{ 
        p: isMobile ? 1 : 2,
        mb: isMobile ? 1 : 3,
        borderRadius: 2
      }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: soccerColors.grassGreen,
          px: 1
        }}>
          <SoccerIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          שחקנים מובילים
        </Typography>
        <List>
          {topPlayers.length > 0 ? (
            topPlayers.map((player, index) => (
              <ListItem
                key={player.id}
                sx={{
                  borderBottom: index < topPlayers.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  },
                  px: isMobile ? 1 : 2,
                  py: isMobile ? 0.5 : 1
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={player.avatar} 
                    sx={{ 
                      width: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40,
                      bgcolor: soccerColors.grassGreen,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {player.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant={isMobile ? 'body2' : 'body1'}>
                      {player.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant={isMobile ? 'caption' : 'body2'} color="textSecondary">
                      {`${player.position} | ${player.team}`}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {player.isHot && (
                      <Chip
                        icon={<StarIcon sx={{ fontSize: isMobile ? 16 : 20 }} />}
                        label="חם"
                        color="error"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{ mr: 1 }}
                      />
                    )}
                    <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ color: soccerColors.grassGreen, fontWeight: 'bold' }}>
                      {formatCurrency(player.value)}
                    </Typography>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant={isMobile ? 'body2' : 'body1'} align="center" color="textSecondary">
                    אין שחקנים זמינים
                  </Typography>
                }
                secondary={
                  <Typography variant={isMobile ? 'caption' : 'body2'} align="center" color="textSecondary">
                    הוסף שחקנים חדשים כדי לראות אותם כאן
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* אירועים קרובים */}
      <Paper sx={{ 
        p: isMobile ? 1 : 2,
        borderRadius: 2
      }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: soccerColors.grassGreen,
          px: 1
        }}>
          <EventIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          אירועים קרובים
        </Typography>
        <Grid container spacing={isMobile ? 1 : 2}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventIcon sx={{ mr: 1, color: soccerColors.grassGreen, fontSize: isMobile ? 20 : 24 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant={isMobile ? 'subtitle2' : 'h6'}>{event.title}</Typography>
                        <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                          {new Date(event.startDate).toLocaleDateString('he-IL')}
                        </Typography>
                      </Box>
                      {event.isImportant && (
                        <IconButton size={isMobile ? 'small' : 'medium'}>
                          <StarIcon sx={{ color: soccerColors.refereeYellow, fontSize: isMobile ? 16 : 20 }} />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ mb: 1 }}>
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {event.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size={isMobile ? 'small' : 'medium'}
                          sx={{ 
                            backgroundColor: soccerColors.grassGreen,
                            color: 'white',
                            fontSize: isMobile ? 10 : 12
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography 
                    align="center" 
                    color="text.secondary"
                    variant={isMobile ? 'body2' : 'body1'}
                  >
                    אין אירועים קרובים
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 