export interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  avatar?: string;
  tags: string[];
  isFavorite: boolean;
  lastContact?: string; // ISO date string
  notes?: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
} 
