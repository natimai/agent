import store from '../store';
import { addEvent, resolveEvent } from '../store/slices/scoutingSlice';
import { ScoutingEvent, ScoutingEventType } from '../types/scoutingEvent';
import { Scout } from '../types/scout';
import { Country } from '../types/country';
import { scoutManager } from './scoutManager';

class EventSystem {
  private readonly EVENT_COOLDOWN = 7; // ימים מינימום בין אירועים
  private lastEventDates: Map<string, Date> = new Map();

  checkForEvents(currentDate: Date) {
    const state = store.getState();
    const { scouts, activeScouts } = state.scouting;

    Object.entries(activeScouts).forEach(([scoutId, countryId]) => {
      const scout = scouts.find(s => s.id === scoutId);
      const country = countries.find(c => c.id === countryId);
      
      if (scout && country) {
        this.checkScoutEvent(scout, country, currentDate);
      }
    });
  }

  private checkScoutEvent(scout: Scout, country: Country, currentDate: Date) {
    const lastEventDate = this.lastEventDates.get(`${scout.id}-${country.id}`);
    if (lastEventDate) {
      const daysSinceLastEvent = Math.floor((currentDate.getTime() - lastEventDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastEvent < this.EVENT_COOLDOWN) return;
    }

    const eventChance = this.calculateEventChance(scout, country);
    if (Math.random() < eventChance) {
      const event = this.generateEvent(scout, country);
      store.dispatch(addEvent(event));
      this.lastEventDates.set(`${scout.id}-${country.id}`, currentDate);
    }
  }

  private calculateEventChance(scout: Scout, country: Country): number {
    let baseChance = 0.15; // 15% סיכוי בסיסי ליום

    // בונוסים לסיכוי בהתאם ליכולות הסקאוט
    baseChance += (scout.abilities.evaluation / 500); // מקסימום 20% בונוס
    
    // בונוס למדינות מועדפות
    if (scout.preferredCountries.includes(country.id)) {
      baseChance *= 1.2;
    }

    return Math.min(baseChance, 0.4); // מקסימום 40% סיכוי ליום
  }

  private generateEvent(scout: Scout, country: Country): ScoutingEvent {
    const eventTypes = this.getAvailableEventTypes(scout, country);
    const selectedType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      id: Date.now().toString(),
      type: selectedType,
      countryId: country.id,
      scoutId: scout.id,
      description: this.getEventDescription(selectedType, country),
      options: this.generateEventOptions(selectedType, scout, country)
    };
  }

  private getAvailableEventTypes(scout: Scout, country: Country): ScoutingEventType[] {
    const types: ScoutingEventType[] = [];
    
    // אירועים בהתאם ליכולות הסקאוט
    if (scout.abilities.youth >= 70) types.push('WONDERKID_FOUND');
    if (scout.abilities.evaluation >= 70) types.push('HIDDEN_GEM');
    if (scout.abilities.negotiation >= 70) types.push('BIDDING_WAR');
    
    // אירועים בסיסיים תמיד זמינים
    types.push('LOCAL_CONNECTION', 'TOURNAMENT_ACCESS');
    
    return types;
  }

  private getEventDescription(type: ScoutingEventType, country: Country): string {
    switch (type) {
      case 'WONDERKID_FOUND':
        return `הסקאוט שלך איתר שחקן צעיר מבטיח במיוחד ב${country.name}`;
      case 'HIDDEN_GEM':
        return `התגלה שחקן לא מוכר עם פוטנציאל גבוה בליגות הנמוכות של ${country.name}`;
      case 'BIDDING_WAR':
        return `קבוצות נוספות מתעניינות בשחקן מבטיח מ${country.name}`;
      case 'LOCAL_CONNECTION':
        return `נוצרה הזדמנות ליצור קשר עם סוכן מקומי ב${country.name}`;
      case 'TOURNAMENT_ACCESS':
        return `התגלה טורניר נוער מעניין ב${country.name}`;
      default:
        return 'אירוע חדש התגלה';
    }
  }

  private generateEventOptions(type: ScoutingEventType, scout: Scout, country: Country) {
    const baseOptions = [
      {
        text: 'התעלם',
        action: () => {}
      }
    ];

    switch (type) {
      case 'WONDERKID_FOUND':
        return [
          {
            text: 'שלח לצפות במשחק (₪10,000)',
            cost: 10000,
            successChance: scout.abilities.youth / 100,
            action: () => scoutManager.handleWonderkidDiscovery(scout, country)
          },
          ...baseOptions
        ];

      case 'HIDDEN_GEM':
        return [
          {
            text: 'שלח לבדוק את השחקן (₪5,000)',
            cost: 5000,
            successChance: scout.abilities.evaluation / 100,
            action: () => scoutManager.handleHiddenGem(scout, country)
          },
          ...baseOptions
        ];

      case 'BIDDING_WAR':
        return [
          {
            text: 'נסה להקדים את המתחרים (₪15,000)',
            cost: 15000,
            successChance: scout.abilities.negotiation / 100,
            action: () => scoutManager.handleBiddingWar(scout, country)
          },
          ...baseOptions
        ];

      case 'LOCAL_CONNECTION':
        const contactCost = 8000 + Math.floor(Math.random() * 4000);
        return [
          {
            text: `צור קשר עם הסוכן (₪${contactCost.toLocaleString()})`,
            cost: contactCost,
            successChance: (scout.abilities.negotiation + scout.abilities.evaluation) / 200,
            action: () => scoutManager.handleLocalConnection(scout, country)
          },
          ...baseOptions
        ];

      case 'TOURNAMENT_ACCESS':
        const tournamentCost = 12000 + Math.floor(Math.random() * 8000);
        return [
          {
            text: `קנה גישה לטורניר (₪${tournamentCost.toLocaleString()})`,
            cost: tournamentCost,
            successChance: scout.abilities.youth / 100,
            action: () => scoutManager.handleTournamentAccess(scout, country)
          },
          ...baseOptions
        ];

      default:
        return baseOptions;
    }
  }
}

export const eventSystem = new EventSystem(); 