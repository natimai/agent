import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  MissionsState, 
  Mission, 
  MissionProgress,
  DailyChallenge,
  MissionStatus
} from '../../types/missions';

const initialMissions: Mission[] = [
  {
    id: '1',
    title: 'פגישה עם שחקן מבטיח',
    description: 'פגישת היכרות עם שחקן צעיר מהנוער של מכבי חיפה',
    category: 'SCOUTING',
    difficulty: 'EASY',
    status: 'ACTIVE',
    requirements: [
      {
        type: 'LEVEL',
        value: 1,
        description: 'רמה מינימלית נדרשת'
      }
    ],
    objectives: [
      {
        id: 'obj1',
        description: 'קיום פגישה',
        isCompleted: false
      }
    ],
    rewards: [
      {
        type: 'EXPERIENCE',
        amount: 100
      }
    ],
    timeLimit: 86400, // 24 שעות
    startTime: Date.now(),
    isImportant: true
  },
  {
    id: '2',
    title: 'משא ומתן על חוזה',
    description: 'ניהול משא ומתן על חוזה חדש לשחקן קיים',
    category: 'TRANSFERS',
    difficulty: 'MEDIUM',
    status: 'ACTIVE',
    requirements: [
      {
        type: 'REPUTATION',
        value: 100,
        description: 'מוניטין מינימלי נדרש'
      }
    ],
    objectives: [
      {
        id: 'obj1',
        description: 'השגת הסכמה על תנאי החוזה',
        isCompleted: false
      }
    ],
    rewards: [
      {
        type: 'MONEY',
        amount: 10000
      }
    ],
    timeLimit: 172800, // 48 שעות
    startTime: Date.now(),
    isImportant: true
  }
];

const initialState: MissionsState = {
  availableMissions: [],
  activeMissions: initialMissions,
  completedMissions: [],
  missionProgress: [],
  dailyChallenges: [],
  loading: false,
  error: null
};

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setAvailableMissions: (state, action: PayloadAction<Mission[]>) => {
      state.availableMissions = action.payload;
    },

    setActiveMissions: (state, action: PayloadAction<Mission[]>) => {
      state.activeMissions = action.payload;
    },

    setCompletedMissions: (state, action: PayloadAction<Mission[]>) => {
      state.completedMissions = action.payload;
    },

    addMission: (state, action: PayloadAction<Mission>) => {
      const mission = action.payload;
      switch (mission.status) {
        case 'AVAILABLE':
          state.availableMissions.push(mission);
          break;
        case 'ACTIVE':
          state.activeMissions.push(mission);
          break;
        case 'COMPLETED':
          state.completedMissions.push(mission);
          break;
      }
    },

    updateMission: (state, action: PayloadAction<Mission>) => {
      const mission = action.payload;
      const lists: Record<MissionStatus, Mission[]> = {
        'AVAILABLE': state.availableMissions,
        'ACTIVE': state.activeMissions,
        'COMPLETED': state.completedMissions,
        'FAILED': state.completedMissions // משימות שנכשלו גם נשמרות ברשימת המשימות שהושלמו
      };
      
      // מחיקת המשימה מכל הרשימות
      Object.values(lists).forEach(list => {
        const index = list.findIndex(m => m.id === mission.id);
        if (index !== -1) {
          list.splice(index, 1);
        }
      });

      // הוספת המשימה לרשימה המתאימה
      lists[mission.status].push(mission);
    },

    removeMission: (state, action: PayloadAction<string>) => {
      const missionId = action.payload;
      state.availableMissions = state.availableMissions.filter(m => m.id !== missionId);
      state.activeMissions = state.activeMissions.filter(m => m.id !== missionId);
      state.completedMissions = state.completedMissions.filter(m => m.id !== missionId);
    },

    updateMissionProgress: (state, action: PayloadAction<{ 
      missionId: string;
      objectiveId: string;
      currentAmount: number;
    }>) => {
      const { missionId, objectiveId, currentAmount } = action.payload;
      const progress = state.missionProgress.find(mp => mp.missionId === missionId);
      
      if (progress) {
        const objectiveProgress = progress.objectiveProgress.find(op => op.objectiveId === objectiveId);
        if (objectiveProgress) {
          objectiveProgress.currentAmount = currentAmount;
        } else {
          progress.objectiveProgress.push({ objectiveId, currentAmount });
        }
      } else {
        state.missionProgress.push({
          missionId,
          objectiveProgress: [{ objectiveId, currentAmount }],
          lastUpdateTime: Date.now()
        });
      }
    },

    setDailyChallenges: (state, action: PayloadAction<DailyChallenge[]>) => {
      state.dailyChallenges = action.payload;
    },

    updateDailyChallenge: (state, action: PayloadAction<DailyChallenge>) => {
      const challenge = action.payload;
      const index = state.dailyChallenges.findIndex(c => c.id === challenge.id);
      if (index !== -1) {
        state.dailyChallenges[index] = challenge;
      }
    },

    completeObjective: (state, action: PayloadAction<{ missionId: string; objectiveId: string }>) => {
      const { missionId, objectiveId } = action.payload;
      const mission = state.activeMissions.find(m => m.id === missionId);
      if (mission) {
        const objective = mission.objectives.find(o => o.id === objectiveId);
        if (objective) {
          objective.isCompleted = true;
          
          // בדיקה אם כל היעדים הושלמו
          if (mission.objectives.every(o => o.isCompleted)) {
            // העברת המשימה לרשימת המשימות שהושלמו
            mission.status = 'COMPLETED';
            mission.endTime = Date.now();
            state.activeMissions = state.activeMissions.filter(m => m.id !== missionId);
            state.completedMissions.push(mission);
          }
        }
      }
    },

    startMission: (state, action: PayloadAction<string>) => {
      const mission = state.availableMissions.find(m => m.id === action.payload);
      if (mission) {
        mission.status = 'ACTIVE';
        state.activeMissions.push(mission);
        state.availableMissions = state.availableMissions.filter(m => m.id !== action.payload);
      }
    },

    completeMission: (state, action: PayloadAction<string>) => {
      const mission = state.activeMissions.find(m => m.id === action.payload);
      if (mission) {
        mission.status = 'COMPLETED';
        state.completedMissions.push(mission);
        state.activeMissions = state.activeMissions.filter(m => m.id !== action.payload);
      }
    },

    failMission: (state, action: PayloadAction<string>) => {
      const mission = state.activeMissions.find(m => m.id === action.payload);
      if (mission) {
        mission.status = 'FAILED';
        state.activeMissions = state.activeMissions.filter(m => m.id !== action.payload);
      }
    }
  }
});

export const {
  setLoading,
  setError,
  setAvailableMissions,
  setActiveMissions,
  setCompletedMissions,
  addMission,
  updateMission,
  removeMission,
  updateMissionProgress,
  setDailyChallenges,
  updateDailyChallenge,
  completeObjective,
  startMission,
  completeMission,
  failMission
} = missionsSlice.actions;

export default missionsSlice.reducer; 