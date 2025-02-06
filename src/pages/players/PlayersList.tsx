import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { Player, PlayerPosition } from '../../types/player';
import { formatCurrency } from '../../utils/formatters';

const PlayersList: React.FC = () => {
  const navigate = useNavigate();
  const players = useSelector((state: RootState) => state.players.players);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'ALL' | PlayerPosition['main']>('ALL');
  const [sortBy, setSortBy] = useState<'value' | 'potential' | 'age' | 'form'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const positions: { value: 'ALL' | PlayerPosition['main']; label: string }[] = [
    { value: 'ALL', label: 'כל העמדות' },
    { value: 'GK', label: 'שוער' },
    { value: 'CB', label: 'בלם' },
    { value: 'LB', label: 'מגן שמאל' },
    { value: 'RB', label: 'מגן ימין' },
    { value: 'CDM', label: 'קשר הגנתי' },
    { value: 'CM', label: 'קשר מרכזי' },
    { value: 'CAM', label: 'קשר התקפי' },
    { value: 'LW', label: 'מגן שמאלי' },
    { value: 'RW', label: 'מגן ימני' },
    { value: 'ST', label: 'חלוץ' }
  ];

  const sortOptions = [
    { value: 'value', label: 'שווי' },
    { value: 'potential', label: 'פוטנציאל' },
    { value: 'age', label: 'גיל' },
    { value: 'form', label: 'כושר' }
  ];

  const filteredAndSortedPlayers = players
    .filter(player => 
      (searchTerm === '' || player.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedPosition === 'ALL' || player.position.main === selectedPosition)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === 'asc' ? 
        (aValue > bValue ? 1 : -1) :
        (aValue < bValue ? 1 : -1);
    });

  const getFormColor = (form: number) => {
    if (form >= 80) return 'success';
    if (form >= 60) return 'info';
    if (form >= 40) return 'warning';
    return 'error';
  };

  const getPositionColor = (position: PlayerPosition['main']) => {
    switch (position) {
      case 'GK': return '#e91e63';
      case 'CB':
      case 'LB':
      case 'RB': return '#2196f3';
      case 'CDM':
      case 'CM': return '#4caf50';
      case 'CAM': return '#ff9800';
      case 'LW':
      case 'RW':
      case 'ST': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* כותרת וסטטיסטיקות */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          ניהול שחקנים
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  סה"כ שחקנים
                </Typography>
                <Typography variant="h4">
                  {players.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  שווי כולל
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(players.reduce((sum, player) => sum + player.value, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  ממוצע פוטנציאל
                </Typography>
                <Typography variant="h4">
                  {Math.round(players.reduce((sum, player) => sum + player.potential, 0) / players.length)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  גיל ממוצע
                </Typography>
                <Typography variant="h4">
                  {Math.round(players.reduce((sum, player) => sum + player.age, 0) / players.length)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* פילטרים וחיפוש */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="חיפוש שחקן..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>עמדה</InputLabel>
              <Select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value as typeof selectedPosition)}
                label="עמדה"
              >
                {positions.map(pos => (
                  <MenuItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>מיון לפי</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                label="מיון לפי"
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              startIcon={sortOrder === 'asc' ? <TrendingUpIcon /> : <TrendingDownIcon />}
            >
              {sortOrder === 'asc' ? 'עולה' : 'יורד'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* רשימת שחקנים */}
      <Grid container spacing={2}>
        <AnimatePresence>
          {filteredAndSortedPlayers.map((player) => (
            <Grid item xs={12} md={6} lg={4} key={player.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 }
                  }}
                  onClick={() => navigate(`/players/${player.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={player.image}
                        sx={{ 
                          width: 60, 
                          height: 60,
                          mr: 2,
                          bgcolor: getPositionColor(player.position.main)
                        }}
                      >
                        {!player.image && player.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {player.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={player.position.main}
                            size="small"
                            sx={{ bgcolor: getPositionColor(player.position.main), color: 'white' }}
                          />
                          <Chip
                            label={`${player.age} שנים`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          כושר
                        </Typography>
                        <Typography variant="body2" color={`${getFormColor(player.form)}.main`}>
                          {player.form}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={player.form}
                        color={getFormColor(player.form)}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          שווי
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(player.value)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          פוטנציאל
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {Array.from({ length: Math.floor(player.potential / 20) }).map((_, i) => (
                            <StarIcon key={i} sx={{ color: 'warning.main' }} />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {player.isInjured && (
                      <Chip
                        icon={<FlagIcon />}
                        label="פצוע"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

export default PlayersList; 