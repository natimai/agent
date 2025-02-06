import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  OfficeState, 
  OfficeStats, 
  MonthlyReport, 
  OFFICE_LEVELS 
} from '../../types/office';
import { 
  OfficeEvent, 
  Sponsor, 
  StaffMember, 
  Relationship 
} from '../../types/officeEvents';

interface ExtendedOfficeState extends OfficeState {
  events: OfficeEvent[];
  sponsors: Sponsor[];
  staff: StaffMember[];
  relationships: Relationship[];
  activeSponsors: string[];
}

const initialStats: OfficeStats = {
  totalTransfers: 0,
  totalCommissions: 0,
  activeNegotiations: 0,
  successfulDeals: 0,
  failedDeals: 0
};

const initialState: ExtendedOfficeState = {
  currentLevel: 1,
  experience: 0,
  stats: initialStats,
  lastUpgrade: null,
  monthlyReports: [],
  events: [],
  sponsors: [],
  staff: [],
  relationships: [],
  activeSponsors: []
};

const officeSlice = createSlice({
  name: 'office',
  initialState,
  reducers: {
    upgradeOffice: (state, action: PayloadAction<{ cost: number }>) => {
      if (state.currentLevel < OFFICE_LEVELS.length) {
        state.currentLevel += 1;
        state.lastUpgrade = new Date().toISOString();
      }
    },
    
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
    },
    
    updateStats: (state, action: PayloadAction<Partial<OfficeStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    addEvent: (state, action: PayloadAction<OfficeEvent>) => {
      state.events.push(action.payload);
    },
    
    handleEvent: (state, action: PayloadAction<{ eventId: string, optionId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.isHandled = true;
      }
    },
    
    hireStaffMember: (state, action: PayloadAction<StaffMember>) => {
      state.staff.push(action.payload);
    },
    
    fireStaffMember: (state, action: PayloadAction<string>) => {
      state.staff = state.staff.filter(s => s.id !== action.payload);
    },
    
    updateStaffMember: (state, action: PayloadAction<Partial<StaffMember> & { id: string }>) => {
      const index = state.staff.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = { ...state.staff[index], ...action.payload };
      }
    },
    
    addSponsor: (state, action: PayloadAction<Sponsor>) => {
      state.sponsors.push(action.payload);
    },
    
    activateSponsor: (state, action: PayloadAction<string>) => {
      const sponsor = state.sponsors.find(s => s.id === action.payload);
      if (sponsor) {
        sponsor.active = true;
        sponsor.startDate = new Date().toISOString();
        state.activeSponsors.push(action.payload);
      }
    },
    
    deactivateSponsor: (state, action: PayloadAction<string>) => {
      const sponsor = state.sponsors.find(s => s.id === action.payload);
      if (sponsor) {
        sponsor.active = false;
        sponsor.startDate = undefined;
        state.activeSponsors = state.activeSponsors.filter(id => id !== action.payload);
      }
    },
    
    addRelationship: (state, action: PayloadAction<Relationship>) => {
      state.relationships.push(action.payload);
    },
    
    updateRelationship: (state, action: PayloadAction<{ 
      id: string, 
      levelChange: number,
      action: string 
    }>) => {
      const relationship = state.relationships.find(r => r.id === action.payload.id);
      if (relationship) {
        relationship.level = Math.max(-100, Math.min(100, relationship.level + action.payload.levelChange));
        relationship.lastInteraction = new Date().toISOString();
        relationship.history.push({
          date: new Date().toISOString(),
          action: action.payload.action,
          impact: action.payload.levelChange
        });
      }
    },
    
    addMonthlyReport: (state, action: PayloadAction<MonthlyReport>) => {
      state.monthlyReports.unshift(action.payload);
      if (state.monthlyReports.length > 12) {
        state.monthlyReports.pop();
      }
    },
    
    addTransfer: (state) => {
      state.stats.totalTransfers += 1;
    },
    
    addCommission: (state, action: PayloadAction<number>) => {
      state.stats.totalCommissions += action.payload;
      state.experience += Math.floor(action.payload / 1000);
    },
    
    startNegotiation: (state) => {
      state.stats.activeNegotiations += 1;
    },
    
    endNegotiation: (state, action: PayloadAction<{ success: boolean }>) => {
      state.stats.activeNegotiations -= 1;
      if (action.payload.success) {
        state.stats.successfulDeals += 1;
      } else {
        state.stats.failedDeals += 1;
      }
    },
    
    resetStats: (state) => {
      state.stats = initialStats;
    }
  }
});

export const {
  upgradeOffice,
  addExperience,
  updateStats,
  addEvent,
  handleEvent,
  hireStaffMember,
  fireStaffMember,
  updateStaffMember,
  addSponsor,
  activateSponsor,
  deactivateSponsor,
  addRelationship,
  updateRelationship,
  addMonthlyReport,
  addTransfer,
  addCommission,
  startNegotiation,
  endNegotiation,
  resetStats
} = officeSlice.actions;

export default officeSlice.reducer; 