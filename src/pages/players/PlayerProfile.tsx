import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  LocalHospital as InjuryIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatters';
import { PlayerAttributes, PlayerStats, PlayerInjury } from '../../types/player';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`player-tabpanel-${index}`}
    aria-labelledby={`player-tab-${index}`}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const player = useSelector((state: RootState) => 
    state.players.players.find(p => p.id === id)
  );

  const [tabValue, setTabValue] = useState(0);

  if (!player) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>שחקן לא נמצא</Typography>
      </Box>
    );
  }

  const getAttributeColor = (value: number) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'info';
    if (value >= 40) return 'warning';
    return 'error';
  };

  const renderAttributes = (attributes: PlayerAttributes) => (
    <Grid container spacing={2}>
      {Object.entries(attributes).map(([key, value]) => (
        <Grid item xs={12} sm={6} key={key}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {key}
              </Typography>
              <Typography variant="body2" color={`${getAttributeColor(value)}.main`}>
                {value}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={value}
              color={getAttributeColor(value)}
              sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderStats = (stats: PlayerStats) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              הופעות
            </Typography>
            <Typography variant="h4">
              {stats.appearances}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              שערים
            </Typography>
            <Typography variant="h4">
              {stats.goals}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              בישולים
            </Typography>
            <Typography variant="h4">
              {stats.assists}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              דירוג ממוצע
            </Typography>
            <Typography variant="h4">
              {stats.averageRating.toFixed(1)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderInjuryHistory = (injuries: PlayerInjury[]) => (
    <Box>
      {injuries.map((injury, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InjuryIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                {injury.type}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              תאריך התחלה: {new Date(injury.startDate).toLocaleDateString('he-IL')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              משך: {injury.durationDays} ימים
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* כרטיס פרופיל ראשי */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={player.image}
                  sx={{ width: 120, height: 120, mr: 2 }}
                >
                  {!player.image && player.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {player.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={player.position.main} color="primary" />
                    <Chip label={`${player.age} שנים`} variant="outlined" />
                    <Chip label={player.nationality} variant="outlined" />
                    {player.isInjured && (
                      <Chip
                        icon={<FlagIcon />}
                        label="פצוע"
                        color="error"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      שווי שוק
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(player.value)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      שכר
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(player.wage)} / שבוע
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      פוטנציאל
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {Array.from({ length: Math.floor(player.potential / 20) }).map((_, i) => (
                        <StarIcon key={i} sx={{ color: 'warning.main' }} />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* טאבים */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="נתונים" />
          <Tab label="סטטיסטיקות" />
          <Tab label="היסטוריית פציעות" />
          <Tab label="משחק אחרון" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderAttributes(player.attributes)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderStats(player.stats)}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderInjuryHistory(player.injuryHistory)}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {player.lastMatch ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {player.lastMatch.opponent}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {new Date(player.lastMatch.date).toLocaleDateString('he-IL')}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {player.lastMatch.result}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary">דקות</Typography>
                  <Typography variant="h6">{player.lastMatch.stats.minutesPlayed}'</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary">שערים</Typography>
                  <Typography variant="h6">{player.lastMatch.stats.goals}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary">בישולים</Typography>
                  <Typography variant="h6">{player.lastMatch.stats.assists}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary">דירוג</Typography>
                  <Typography variant="h6">{player.lastMatch.stats.rating.toFixed(1)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Typography>אין נתונים על המשחק האחרון</Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default PlayerProfile; 