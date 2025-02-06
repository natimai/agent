import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scout, ScoutingMission, ScoutingReport, ScoutingState } from '../../types/scouting';

const initialState: ScoutingState = {
  scouts: [],
  missions: [],
  reports: [],
  loading: false,
  error: null,
};

const scoutingSlice = createSlice({
  name: 'scouting',
  initialState,
  reducers: {
    setScouts: (state, action: PayloadAction<Scout[]>) => {
      state.scouts = action.payload;
    },
    addScout: (state, action: PayloadAction<Scout>) => {
      state.scouts.push(action.payload);
    },
    updateScout: (state, action: PayloadAction<{ id: string; updates: Partial<Scout> }>) => {
      const scout = state.scouts.find(s => s.id === action.payload.id);
      if (scout) {
        Object.assign(scout, action.payload.updates);
      }
    },
    removeScout: (state, action: PayloadAction<string>) => {
      state.scouts = state.scouts.filter(s => s.id !== action.payload);
    },
    setMissions: (state, action: PayloadAction<ScoutingMission[]>) => {
      state.missions = action.payload;
    },
    addMission: (state, action: PayloadAction<ScoutingMission>) => {
      state.missions.push(action.payload);
    },
    updateMission: (state, action: PayloadAction<{ id: string; updates: Partial<ScoutingMission> }>) => {
      const mission = state.missions.find(m => m.id === action.payload.id);
      if (mission) {
        Object.assign(mission, action.payload.updates);
      }
    },
    removeMission: (state, action: PayloadAction<string>) => {
      state.missions = state.missions.filter(m => m.id !== action.payload);
    },
    setReports: (state, action: PayloadAction<ScoutingReport[]>) => {
      state.reports = action.payload;
    },
    addReport: (state, action: PayloadAction<ScoutingReport>) => {
      state.reports.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<{ id: string; updates: Partial<ScoutingReport> }>) => {
      const report = state.reports.find(r => r.id === action.payload.id);
      if (report) {
        Object.assign(report, action.payload.updates);
      }
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(r => r.id !== action.payload);
    },
    assignMissionToScout: (state, action: PayloadAction<{ missionId: string; scoutId: string }>) => {
      const { missionId, scoutId } = action.payload;
      const mission = state.missions.find(m => m.id === missionId);
      const scout = state.scouts.find(s => s.id === scoutId);
      
      if (mission && scout) {
        mission.assignedScout = scoutId;
        mission.status = 'in_progress';
        scout.currentMission = missionId;
      }
    },
    completeMission: (state, action: PayloadAction<{ 
      missionId: string;
      success: boolean;
      report?: ScoutingReport;
    }>) => {
      const { missionId, success, report } = action.payload;
      const mission = state.missions.find(m => m.id === missionId);
      
      if (mission) {
        mission.status = success ? 'completed' : 'failed';
        mission.endDate = new Date().toISOString();
        
        if (mission.assignedScout) {
          const scout = state.scouts.find(s => s.id === mission.assignedScout);
          if (scout) {
            scout.currentMission = undefined;
            if (success) {
              scout.stats.successfulMissions++;
            } else {
              scout.stats.failedMissions++;
            }
          }
        }
        
        if (report) {
          state.reports.push(report);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setScouts,
  addScout,
  updateScout,
  removeScout,
  setMissions,
  addMission,
  updateMission,
  removeMission,
  setReports,
  addReport,
  updateReport,
  removeReport,
  assignMissionToScout,
  completeMission,
  setLoading,
  setError,
} = scoutingSlice.actions;

export default scoutingSlice.reducer; 