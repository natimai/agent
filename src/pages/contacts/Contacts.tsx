import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { Contact } from '../../types/contacts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`contacts-tabpanel-${index}`}
    aria-labelledby={`contacts-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Contacts: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { contacts, loading } = useSelector((state: RootState) => state.contacts);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.role.toLowerCase().includes(searchLower) ||
      contact.organization.toLowerCase().includes(searchLower)
    );
  });

  const favoriteContacts = filteredContacts.filter(contact => contact.isFavorite);
  const recentContacts = filteredContacts.slice(0, 5); // 5 אנשי הקשר האחרונים
  const allContacts = filteredContacts;

  const renderContactCard = (contact: Contact) => (
    <Grid item xs={12} md={6} lg={4} key={contact.id}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={contact.avatar}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {contact.name}
                </Typography>
                <IconButton size="small">
                  {contact.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {contact.role} ב{contact.organization}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {contact.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {contact.phone && (
              <IconButton color="primary" size="small">
                <PhoneIcon />
              </IconButton>
            )}
            {contact.email && (
              <IconButton color="primary" size="small">
                <EmailIcon />
              </IconButton>
            )}
            {contact.whatsapp && (
              <IconButton color="primary" size="small">
                <WhatsAppIcon />
              </IconButton>
            )}
          </Box>

          {contact.lastContact && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              שיחה אחרונה: {new Date(contact.lastContact).toLocaleDateString('he-IL')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">אנשי קשר</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          הוסף איש קשר
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="חיפוש אנשי קשר..."
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
        aria-label="contacts tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="מועדפים" />
        <Tab label="אחרונים" />
        <Tab label="כל אנשי הקשר" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {favoriteContacts.map(renderContactCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          {recentContacts.map(renderContactCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          {allContacts.map(renderContactCard)}
        </Grid>
      </TabPanel>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>הוספת איש קשר חדש</DialogTitle>
        <DialogContent>
          {/* טופס הוספת איש קשר */}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="שם מלא"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="תפקיד"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="ארגון"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="טלפון"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="אימייל"
              variant="outlined"
              sx={{ mb: 2 }}
            />
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

export default Contacts; 