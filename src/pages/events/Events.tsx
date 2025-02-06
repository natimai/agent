import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { Event } from '../../types/events';
import { formatDate } from '../../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`events-tabpanel-${index}`}
    aria-labelledby={`events-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Events: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { events, loading } = useSelector((state: RootState) => state.events);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.startDate) > new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.endDate) < new Date());
  const importantEvents = filteredEvents.filter(event => event.isImportant);

  const renderEventCard = (event: Event) => (
    <Grid item xs={12} md={6} lg={4} key={event.id}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {event.title}
                </Typography>
                <IconButton size="small">
                  {event.isImportant ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {event.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>

          {event.participants && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.participants.length} משתתפים
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {event.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">אירועים</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          הוסף אירוע
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="חיפוש אירועים..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="events tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="אירועים קרובים" />
        <Tab label="אירועים חשובים" />
        <Tab label="אירועים שעברו" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {upcomingEvents.map(renderEventCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          {importantEvents.map(renderEventCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          {pastEvents.map(renderEventCard)}
        </Grid>
      </TabPanel>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>הוספת אירוע חדש</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="כותרת"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="תיאור"
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="מיקום"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="תאריך התחלה"
                  type="datetime-local"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="תאריך סיום"
                  type="datetime-local"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>סוג אירוע</InputLabel>
              <Select label="סוג אירוע">
                <MenuItem value="MATCH">משחק</MenuItem>
                <MenuItem value="TRAINING">אימון</MenuItem>
                <MenuItem value="MEETING">פגישה</MenuItem>
                <MenuItem value="SCOUTING">סיור</MenuItem>
                <MenuItem value="OTHER">אחר</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="תגיות (מופרדות בפסיקים)"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={() => setIsAddDialogOpen(false)}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events; 