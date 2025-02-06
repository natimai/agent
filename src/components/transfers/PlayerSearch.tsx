import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiDollarSign, FiStar, FiUser, FiCalendar } from 'react-icons/fi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Chip,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { RootState } from '../../store';
import { addOffer } from '../../store/slices/transfersSlice';
import { TransferOffer } from '../../types/transfers';
import { Player, PlayerPosition } from '../../types/player';
import { formatCurrency } from '../../utils/formatters';

interface PlayerSearchProps {
  open: boolean;
  onClose: () => void;
  onPlayerSelect: (player: Player) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ open, onClose, onPlayerSelect }) => {
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players.players);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition | 'ALL'>('ALL');
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 40]);
  const [valueRange, setValueRange] = useState<[number, number]>([0, 100000000]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);

  const handleCreateOffer = (playerId: string) => {
    const newOffer: TransferOffer = {
      id: Date.now().toString(),
      playerId,
      fromTeamId: 'current_team_id', // יש להחליף בID אמיתי
      toTeamId: 'target_team_id', // יש להחליף בID אמיתי
      initialOffer: 1000000, // סכום התחלתי לדוגמה
      currentOffer: 1000000,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // תוקף ל-7 ימים
      negotiationStage: 'INITIAL',
      counterOffers: [],
      conditions: [],
      agentFeePercentage: 5,
      reputationImpact: 10,
      messages: []
    };

    dispatch(addOffer(newOffer));
  };

  useEffect(() => {
    const filtered = players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'ALL' || player.position === selectedPosition;
      const matchesAge = player.age >= ageRange[0] && player.age <= ageRange[1];
      const matchesValue = player.value >= valueRange[0] && player.value <= valueRange[1];

      return matchesSearch && matchesPosition && matchesAge && matchesValue;
    });

    setFilteredPlayers(filtered);
  }, [players, searchTerm, selectedPosition, ageRange, valueRange]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          חיפוש שחקנים
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* פילטרים */}
        <Box sx={{ mb: 3, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <TextField
            label="חיפוש לפי שם"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>עמדה</InputLabel>
            <Select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as PlayerPosition | 'ALL')}
              label="עמדה"
            >
              <MenuItem value="ALL">הכל</MenuItem>
              <MenuItem value="GK">שוער</MenuItem>
              <MenuItem value="DEF">הגנה</MenuItem>
              <MenuItem value="MID">קישור</MenuItem>
              <MenuItem value="FWD">התקפה</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>גיל</Typography>
            <Slider
              value={ageRange}
              onChange={(_, newValue) => setAgeRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={16}
              max={40}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{ageRange[0]}</Typography>
              <Typography variant="caption">{ageRange[1]}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography gutterBottom>שווי</Typography>
            <Slider
              value={valueRange}
              onChange={(_, newValue) => setValueRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100000000}
              valueLabelFormat={(value) => formatCurrency(value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{formatCurrency(valueRange[0])}</Typography>
              <Typography variant="caption">{formatCurrency(valueRange[1])}</Typography>
            </Box>
          </Box>
        </Box>

        {/* רשימת שחקנים */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {filteredPlayers.map((player) => (
            <Card key={player.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1">{player.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {player.position} • גיל {player.age}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatCurrency(player.value)}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      onPlayerSelect(player);
                      onClose();
                    }}
                  >
                    בחר שחקן
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSearch; 