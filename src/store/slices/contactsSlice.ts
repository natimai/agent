import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactsState, Contact } from '../../types/contacts';

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
    },
    
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
    },
    
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload);
      if (contact) {
        contact.isFavorite = !contact.isFavorite;
      }
    },
    
    updateLastContact: (state, action: PayloadAction<{ id: string; date: string }>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload.id);
      if (contact) {
        contact.lastContact = action.payload.date;
      }
    },
    
    addTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload.id);
      if (contact && !contact.tags.includes(action.payload.tag)) {
        contact.tags.push(action.payload.tag);
      }
    },
    
    removeTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload.id);
      if (contact) {
        contact.tags = contact.tags.filter(tag => tag !== action.payload.tag);
      }
    },
    
    updateSocialMedia: (state, action: PayloadAction<{ 
      id: string; 
      platform: keyof Contact['socialMedia']; 
      url: string 
    }>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload.id);
      if (contact && contact.socialMedia) {
        contact.socialMedia[action.payload.platform] = action.payload.url;
      }
    },
    
    updateAddress: (state, action: PayloadAction<{
      id: string;
      address: Contact['address'];
    }>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload.id);
      if (contact) {
        contact.address = action.payload.address;
      }
    }
  }
});

export const {
  setLoading,
  setError,
  setContacts,
  addContact,
  updateContact,
  deleteContact,
  toggleFavorite,
  updateLastContact,
  addTag,
  removeTag,
  updateSocialMedia,
  updateAddress
} = contactsSlice.actions;

export default contactsSlice.reducer; 