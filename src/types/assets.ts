export type AssetType = 'PROPERTY' | 'VEHICLE' | 'EQUIPMENT' | 'LUXURY';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  cost: number;
  monthlyMaintenance: number;
  reputationBonus: number;
  description: string;
  image?: string;
  benefits: {
    [key: string]: number;
  };
  requirements?: {
    minReputation?: number;
    minLevel?: number;
  };
  condition?: number;
  purchaseDate?: string;
}

export interface Property extends Asset {
  type: 'PROPERTY';
  propertyType: 'HOUSE' | 'APARTMENT' | 'OFFICE' | 'VILLA' | 'PENTHOUSE';
  size: number; // במטרים רבועים
  location: string;
  amenities: string[];
}

export interface Vehicle extends Asset {
  type: 'VEHICLE';
  vehicleType: 'CAR' | 'SUV' | 'LUXURY_CAR' | 'SPORTS_CAR';
  brand: string;
  model: string;
  year: number;
  features: string[];
}

export interface LuxuryItem extends Asset {
  type: 'LUXURY';
  category: 'WATCH' | 'JEWELRY' | 'ART' | 'COLLECTIBLE';
  brand?: string;
  rarity?: 'COMMON' | 'RARE' | 'EXCLUSIVE' | 'UNIQUE';
}

export interface AssetStore {
  properties: Property[];
  vehicles: Vehicle[];
  luxuryItems: LuxuryItem[];
}

export interface AssetsState {
  ownedAssets: Asset[];
  totalMaintenance: number;
  totalValue: number;
  reputationBonus: number;
} 