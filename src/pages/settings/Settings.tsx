import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { RootState } from '../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Settings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const dispatch = useDispatch();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        הגדרות
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="settings tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="כללי" />
        <Tab label="התראות" />
        <Tab label="פרטי משתמש" />
        <Tab label="אבטחה" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  הגדרות משחק
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch />}
                    label="מצב אוטומטי"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>
                    רמת קושי
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value="medium"
                      size="small"
                    >
                      <MenuItem value="easy">קל</MenuItem>
                      <MenuItem value="medium">בינוני</MenuItem>
                      <MenuItem value="hard">קשה</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>
                    מהירות משחק
                  </Typography>
                  <Slider
                    defaultValue={1}
                    step={0.5}
                    marks
                    min={0.5}
                    max={2}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  הגדרות תצוגה
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="מצב כהה"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>
                    גודל גופן
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value="medium"
                      size="small"
                    >
                      <MenuItem value="small">קטן</MenuItem>
                      <MenuItem value="medium">בינוני</MenuItem>
                      <MenuItem value="large">גדול</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="הנפשות"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              הגדרות התראות
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="התראות דחופות"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="התראות על הצעות העברה"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="התראות על משימות"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="התראות על אירועים"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="התראות על עדכוני מערכת"
              />
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              פרטי משתמש
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>שם מלא</InputLabel>
                  <Select
                    value=""
                    label="שם מלא"
                  >
                    <MenuItem value="">
                      <em>ללא</em>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>דואר אלקטרוני</InputLabel>
                  <Select
                    value=""
                    label="דואר אלקטרוני"
                  >
                    <MenuItem value="">
                      <em>ללא</em>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>טלפון</InputLabel>
                  <Select
                    value=""
                    label="טלפון"
                  >
                    <MenuItem value="">
                      <em>ללא</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box
                    component="img"
                    src="/avatar-placeholder.png"
                    alt="תמונת פרופיל"
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  />
                  <Button variant="outlined">
                    החלף תמונה
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              הגדרות אבטחה
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="אימות דו-שלבי"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Button variant="contained" color="primary">
                שנה סיסמה
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Button variant="contained" color="error">
                מחק חשבון
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default Settings; 