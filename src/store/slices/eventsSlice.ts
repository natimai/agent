import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventsState } from '../../types/events';

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'טורניר נוער בינלאומי',
    description: 'טורניר בינלאומי לשחקני נוער עד גיל 19 בברצלונה',
    type: 'SCOUTING',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // בעוד שבוע
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'ברצלונה, ספרד',
    isImportant: true,
    tags: ['סקאוטינג', 'נוער', 'בינלאומי'],
    participants: [
      {
        id: '1',
        name: 'יוסי כהן',
        role: 'סקאוט ראשי'
      }
    ]
  },
  {
    id: '2',
    title: 'פגישת מו"מ',
    description: 'פגישת משא ומתן עם נציגי מכבי חיפה',
    type: 'MEETING',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // בעוד יומיים
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'משרדי המועדון, חיפה',
    isImportant: true,
    tags: ['העברות', 'מו"מ'],
    reminders: [
      {
        id: '1',
        time: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(), // תזכורת שעה לפני
        message: 'פגישת מו"מ בעוד שעה',
        sent: false
      }
    ]
  }
];

const initialState: EventsState = {
  events: initialEvents,
  loading: false,
  error: null
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    toggleEventImportance: (state, action: PayloadAction<string>) => {
      const event = state.events.find(event => event.id === action.payload);
      if (event) {
        event.isImportant = !event.isImportant;
      }
    },
    addEventParticipant: (state, action: PayloadAction<{
      eventId: string;
      participant: { id: string; name: string; role: string; }
    }>) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event && event.participants) {
        event.participants.push(action.payload.participant);
      }
    },
    removeEventParticipant: (state, action: PayloadAction<{
      eventId: string;
      participantId: string;
    }>) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event && event.participants) {
        event.participants = event.participants.filter(p => p.id !== action.payload.participantId);
      }
    },
    addEventReminder: (state, action: PayloadAction<{
      eventId: string;
      reminder: { id: string; time: string; message: string; sent: boolean; }
    }>) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event && event.reminders) {
        event.reminders.push(action.payload.reminder);
      }
    },
    markReminderAsSent: (state, action: PayloadAction<{
      eventId: string;
      reminderId: string;
    }>) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event && event.reminders) {
        const reminder = event.reminders.find(r => r.id === action.payload.reminderId);
        if (reminder) {
          reminder.sent = true;
        }
      }
    }
  }
});

export const {
  setLoading,
  setError,
  setEvents,
  addEvent,
  updateEvent,
  removeEvent,
  toggleEventImportance,
  addEventParticipant,
  removeEventParticipant,
  addEventReminder,
  markReminderAsSent
} = eventsSlice.actions;

export default eventsSlice.reducer; 