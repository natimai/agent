import store from '../store';
import { Scout } from '../types/scout';
import { ScoutingEvent, ScoutingEventType } from '../types/scoutingEvent';
import { LocalContact } from '../types/localContact';
import { YouthTournament } from '../types/youthTournament';
import { ScoutingReport } from '../types/scoutingReport';
import { Player, Position, PlayerAttributes } from '../types/player';
import { Country } from '../types/country';
import { countries } from '../data/countries';
import { 
  addScout, 
  updateScout, 
  addEvent, 
  addContact, 
  addTournament,
  assignScout,
  unassignScout,
  updateScoutStats,
  paySalaries,
  updateScoutProgress
} from '../store/slices/scoutingSlice';
import { updateTreasury } from '../store/slices/gameSlice';
import { generateRandomName, generateNameByCountry } from '../utils/nameGenerators';
import { playerGenerator } from './playerGenerator';
import { OFFICE_LEVELS } from '../types/office';

class ScoutManager {
  private readonly BASE_SCOUT_COST = 5000;
  private readonly LEVEL_COST_MULTIPLIER = 1.5;
  private readonly EVENT_CHANCE = 0.15;
  private readonly BASE_SALARY = 5000;
  private readonly SALARY_LEVEL_MULTIPLIER = 1.2;

  // מחשב משכורת חודשית לסקאוט
  calculateMonthlySalary(scout: Scout): number {
    return Math.floor(this.BASE_SALARY * Math.pow(this.SALARY_LEVEL_MULTIPLIER, scout.level - 1));
  }

  // תשלום משכורות חודשיות
  payMonthlySalaries(): void {
    const state = store.getState();
    const { scouts } = state.scouting;
    
    const salaryDetails: { [key: string]: number } = {};
    let totalAmount = 0;

    scouts.forEach(scout => {
      const salary = this.calculateMonthlySalary(scout);
      salaryDetails[scout.id] = salary;
      totalAmount += salary;
    });

    if (state.game.treasury >= totalAmount) {
      store.dispatch(updateTreasury(-totalAmount));
      store.dispatch(payMonthlySalaries({
        totalAmount,
        details: salaryDetails,
        date: new Date().toISOString()
      }));
    } else {
      throw new Error('אין מספיק כסף לשלם משכורות');
    }
  }

  // שיפור פונקציית יצירת סקאוט חדש
  generateNewScout(level: number = 1): Scout {
    const abilities = this.generateAbilities(level);
    const monthlySalary = this.calculateMonthlySalary({ level } as Scout);

    const scout: Scout = {
      id: Date.now().toString(),
      name: this.generateScoutName(),
      level,
      salary: monthlySalary,
      lastPaidDate: new Date().toISOString(),
      abilities,
      specialties: this.generateSpecialties(),
      preferredCountries: this.generatePreferredCountries(),
      operationalCosts: {
        baseDaily: 100 * level,
        travelMultiplier: 1 + (level * 0.1)
      },
      stats: {
        successfulFinds: 0,
        reportsSubmitted: 0,
        accuracy: 70 + (level * 2)
      }
    };

    return scout;
  }

  private generateAbilities(level: number): Scout['abilities'] {
    const baseValue = 50 + (level * 5);
    const variation = 10;

    return {
      evaluation: Math.min(100, baseValue + Math.floor(Math.random() * variation)),
      negotiation: Math.min(100, baseValue + Math.floor(Math.random() * variation)),
      youth: Math.min(100, baseValue + Math.floor(Math.random() * variation))
    };
  }

  private generateSpecialties(): Position[] {
    const positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    const count = 1 + Math.floor(Math.random() * 2);
    const specialties: Position[] = [];
    
    while (specialties.length < count) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      if (!specialties.includes(pos)) {
        specialties.push(pos);
      }
    }
    
    return specialties;
  }

  private generatePreferredCountries(): string[] {
    // כאן תהיה לוגיקה לבחירת מדינות מועדפות
    return ['IL', 'ES', 'IT'].slice(0, 1 + Math.floor(Math.random() * 2));
  }

  private generateScoutName(): string {
    const firstNames = ['משה', 'יוסי', 'דוד', 'אבי', 'יעקב', 'דן', 'גיא', 'רון'];
    const lastNames = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'אברהם', 'דוד', 'שלום'];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  calculateMissionCosts(scout: Scout, countryId: string, duration: number): number {
    const country = countries.find(c => c.id === countryId);
    if (!country) throw new Error('מדינה לא נמצאה');

    const baseDaily = 100 + (scout.level * 50);
    const distanceMultiplier = this.getDistanceMultiplier(country.type);
    const operationalCosts = baseDaily * duration;
    const travelCosts = Math.floor(operationalCosts * distanceMultiplier);
    const salary = Math.floor(scout.salary * (duration / 30));

    return salary + operationalCosts + travelCosts;
  }

  private getDistanceMultiplier(countryType: 'LOCAL' | 'NEARBY' | 'CONTINENTAL' | 'INTERNATIONAL'): number {
    const multipliers = {
      LOCAL: 1,
      NEARBY: 1.5,
      CONTINENTAL: 2,
      INTERNATIONAL: 3
    };
    return multipliers[countryType];
  }

  startMission(scout: Scout, countryId: string, duration: number): void {
    const costs = this.calculateMissionCosts(scout, countryId, duration);
    const state = store.getState();
    
    if (state.game.treasury < costs) {
      throw new Error('אין מספיק תקציב למשימה');
    }

    store.dispatch(updateTreasury(-costs));
    store.dispatch(assignScout({
      scoutId: scout.id,
      mission: {
        countryId,
        startDate: new Date().toISOString(),
        duration,
        cost: costs
      }
    }));
  }

  endMission(scout: Scout): void {
    if (!scout.currentMission) return;
    
    // עדכון סטטיסטיקות
    const successRate = (scout.abilities.evaluation + scout.abilities.youth) / 200;
    const foundPlayers = Math.floor(Math.random() * 3 * successRate) + 1;
    
    store.dispatch(updateScoutStats({
      scoutId: scout.id,
      stats: {
        successfulFinds: scout.stats.successfulFinds + foundPlayers,
        reportsSubmitted: scout.stats.reportsSubmitted + 1,
        accuracy: (scout.stats.accuracy + (successRate * 100)) / 2
      }
    }));

    store.dispatch(unassignScout(scout.id));
  }

  checkForEvents(scout: Scout, country: Country): void {
    if (Math.random() < this.EVENT_CHANCE) {
      const event = this.generateRandomEvent(scout, country);
      store.dispatch(addEvent(event));
    }
  }

  private generateRandomEvent(scout: Scout, country: Country): ScoutingEvent {
    const eventTypes: ScoutingEventType[] = [
      'WONDERKID_FOUND',
      'HIDDEN_GEM',
      'BIDDING_WAR',
      'LOCAL_CONNECTION',
      'TOURNAMENT_ACCESS'
    ];

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      type,
      countryId: country.id,
      description: this.getEventDescription(type, country),
      options: this.generateEventOptions(type, scout, country)
    };
  }

  private getEventDescription(type: ScoutingEventType, country: Country): string {
    switch (type) {
      case 'WONDERKID_FOUND':
        return `הסקאוט שלך איתר כישרון צעיר מבטיח ב${country.name}`;
      case 'HIDDEN_GEM':
        return `התגלה שחקן לא מוכר עם פוטנציאל גבוה בליגות הנמוכות של ${country.name}`;
      // ... המשך התיאורים
    }
  }

  private generateEventOptions(type: ScoutingEventType, scout: Scout, country: Country) {
    switch (type) {
      case 'WONDERKID_FOUND':
        return [
          {
            text: 'שלח לצפות במשחק (₪10,000)',
            cost: 10000,
            successChance: scout.abilities.youth / 100,
            action: () => this.handleWonderkidDiscovery(scout, country)
          },
          {
            text: 'התעלם',
            action: () => {}
          }
        ];
      // ... אפשרויות נוספות לכל סוג אירוע
    }
  }

  generateScoutingReport(scout: Scout, player: Player): ScoutingReport {
    const accuracy = (scout.abilities.evaluation / 100) * 
                    (scout.specialties.includes(player.position.main) ? 1.2 : 1);

    return {
      id: Date.now().toString(),
      playerId: player.id,
      scoutId: scout.id,
      date: new Date().toISOString(),
      accuracy: Math.min(100, Math.floor(accuracy * 100)),
      observations: this.generateObservations(player, accuracy),
      recommendations: this.generateRecommendations(player, scout),
      comparisons: this.generateComparisons(player)
    };
  }

  private generateObservations(player: Player, accuracy: number) {
    return Object.entries(player.attributes).map(([attr, value]) => {
      const error = Math.floor((1 - accuracy) * 20);
      const estimated = Math.max(1, Math.min(99, value + (Math.random() * error * 2 - error)));
      
      return {
        attribute: attr as keyof PlayerAttributes,
        estimatedValue: Math.floor(estimated),
        confidence: Math.floor(accuracy * 100),
        notes: this.generateAttributeNote(attr as keyof PlayerAttributes, estimated)
      };
    });
  }

  private handleWonderkidDiscovery(scout: Scout, country: Country): void {
    const state = store.getState();
    if (state.game.treasury < 10000) {
      throw new Error('אין מספיק תקציב לצפות בשחקן');
    }

    store.dispatch(updateTreasury(-10000));

    const successRoll = Math.random();
    const successChance = scout.abilities.youth / 100;

    if (successRoll <= successChance) {
      // יצירת שחקן צעיר עם פוטנציאל גבוה
      const wonderkid = playerGenerator.generatePlayer({
        ageRange: { min: 15, max: 18 },
        nationality: country.code,
        nameGenerator: country.playerNameGenerator,
        minRating: 60,
        maxRating: 75,
        potentialBonus: 20, // בונוס לפוטנציאל
        attributeModifiers: country.style.attributes
      });

      store.dispatch(addPlayer(wonderkid));
      this.createWonderkidReport(scout, wonderkid, country);
    }
  }

  private handleHiddenGem(scout: Scout, country: Country): void {
    const state = store.getState();
    if (state.game.treasury < 5000) {
      throw new Error('אין מספיק תקציב למעקב אחר השחקן');
    }

    store.dispatch(updateTreasury(-5000));

    const successRoll = Math.random();
    const successChance = scout.abilities.evaluation / 100;

    if (successRoll <= successChance) {
      // יצירת שחקן מבוגר יותר עם יכולות טובות
      const hiddenGem = playerGenerator.generatePlayer({
        ageRange: { min: 21, max: 27 },
        nationality: country.code,
        nameGenerator: country.playerNameGenerator,
        minRating: 70,
        maxRating: 82,
        attributeModifiers: country.style.attributes
      });

      store.dispatch(addPlayer(hiddenGem));
      this.createHiddenGemReport(scout, hiddenGem, country);
    }
  }

  private handleLocalConnection(scout: Scout, country: Country): void {
    const contact: LocalContact = {
      id: Date.now().toString(),
      countryId: country.id,
      name: generateNameByCountry(country.code),
      influence: 50 + Math.floor(Math.random() * 30),
      trust: 30 + Math.floor(Math.random() * 40),
      services: this.generateLocalServices(country),
      lastUsed: new Date().toISOString()
    };

    store.dispatch(addContact(contact));
  }

  private generateLocalServices(country: Country) {
    const services = [];
    const possibleServices = [
      {
        type: 'INFO' as const,
        description: 'מידע על שחקנים מקומיים',
        cost: 2000,
        cooldown: 7
      },
      {
        type: 'ACCESS' as const,
        description: 'גישה לאימוני נוער',
        cost: 5000,
        cooldown: 14
      },
      {
        type: 'NEGOTIATION' as const,
        description: 'עזרה במשא ומתן',
        cost: 8000,
        cooldown: 30
      }
    ];

    // בחירה רנדומלית של 1-3 שירותים
    const count = 1 + Math.floor(Math.random() * 3);
    while (services.length < count) {
      const service = possibleServices[Math.floor(Math.random() * possibleServices.length)];
      if (!services.find(s => s.type === service.type)) {
        services.push({
          ...service,
          cost: service.cost * (0.8 + Math.random() * 0.4) // וריאציה של ±20% במחיר
        });
      }
    }

    return services;
  }

  private handleTournamentAccess(scout: Scout, country: Country): void {
    const tournament: YouthTournament = {
      id: Date.now().toString(),
      name: this.generateTournamentName(country),
      countryId: country.id,
      startDate: new Date().toISOString(),
      duration: 7 + Math.floor(Math.random() * 7), // 7-14 ימים
      level: this.generateTournamentLevel(),
      teamsCount: 8 + Math.floor(Math.random() * 9) * 2, // 8/16/24 קבוצות
      prospects: this.generateTournamentProspects(country),
      accessCost: 15000 + Math.floor(Math.random() * 10000)
    };

    store.dispatch(addTournament(tournament));
  }

  private generateTournamentName(country: Country): string {
    const types = ['גביע', 'טורניר', 'אליפות'];
    const categories = ['נוער', 'צעירים', 'עתודה'];
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    return `${type} ${category} ${country.name}`;
  }

  private generateTournamentLevel(): 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL' {
    const roll = Math.random();
    if (roll < 0.6) return 'REGIONAL';
    if (roll < 0.9) return 'NATIONAL';
    return 'INTERNATIONAL';
  }

  private generateTournamentProspects(country: Country): YouthTournament['prospects'] {
    const count = 3 + Math.floor(Math.random() * 4); // 3-6 שחקנים
    const prospects: YouthTournament['prospects'] = [];

    for (let i = 0; i < count; i++) {
      const player = playerGenerator.generatePlayer({
        ageRange: { min: 15, max: 19 },
        nationality: country.code,
        nameGenerator: country.playerNameGenerator,
        minRating: 60,
        maxRating: 75
      });

      prospects.push({
        playerId: player.id,
        potential: player.potential,
        observationCost: 2000 + Math.floor(Math.random() * 3000)
      });

      store.dispatch(addPlayer(player));
    }

    return prospects;
  }

  canHireScout(): boolean {
    const state = store.getState();
    const currentScouts = state.scouting.scouts.length;
    const maxScouts = this.getMaxScouts(state.office.level);
    
    return currentScouts < maxScouts;
  }

  calculateHiringCost(level: number): number {
    return this.BASE_SCOUT_COST * Math.pow(this.LEVEL_COST_MULTIPLIER, level - 1);
  }

  hireScout(scout: Scout) {
    const state = store.getState();
    const hiringCost = this.calculateHiringCost(scout.level);
    
    if (!this.canHireScout()) {
      throw new Error('הגעת למגבלת הסקאוטים המקסימלית. שדרג את המשרד כדי להגדיל את המכסה.');
    }
    
    if (state.game.treasury < hiringCost) {
      throw new Error('אין מספיק כסף לגיוס הסקאוט');
    }
    
    store.dispatch(updateTreasury(-hiringCost));
    store.dispatch(addScout(scout));
  }

  getMaxScouts(officeLevel: number): number {
    if (!officeLevel || officeLevel < 1 || officeLevel > OFFICE_LEVELS.length) {
      return OFFICE_LEVELS[0].maxScouts; // ברירת מחדל - רמה 1
    }

    return OFFICE_LEVELS[officeLevel - 1].maxScouts;
  }
}

export const scoutManager = new ScoutManager(); 