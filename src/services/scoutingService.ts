import { store } from '../store';
import { Player } from '../types/player';
import { playerGenerator } from './playerGenerator';
import { addPlayer, updatePlayer } from '../store/slices/playersSlice';
import { updateTreasury } from '../store/slices/treasurySlice';
import { Country } from '../types/country';
import { Position } from '../types/position';
import { Scout } from '../types/scout';
import { countries } from '../data/countries';
import { addScout } from '../store/slices/scoutingSlice';
import { addSalaryPayment } from '../store/slices/gameSlice';
import { RootState, SalaryPayment } from '../types/types';

class ScoutingService {
  private readonly BASE_SCOUTING_TIME = 7; // ימים בסיס
  private scoutingMissions: Map<string, {
    country: Country;
    progress: number;
    remainingDays: number;
  }> = new Map();

  private scouts: Map<string, Scout> = new Map();

  discoverNewPlayers(count: number): void {
    const state = store.getState() as unknown as RootState;
    const { level } = state.office;
    const treasury = state.treasury;

    // עלות גילוי שחקן חדש
    const costPerPlayer = 1000 * level.level;
    const totalCost = costPerPlayer * count;

    if (treasury.balance < totalCost) {
      throw new Error('אין מספיק תקציב לגילוי שחקנים חדשים');
    }

    // מחיר הגילוי
    store.dispatch(updateTreasury({ balance: treasury.balance - totalCost }));

    // יצירת שחקנים חדשים
    for (let i = 0; i < count; i++) {
      const player = playerGenerator.generatePlayer({});
      store.dispatch(addPlayer({
        ...player,
        isDiscovered: false
      }));
    }
  }

  startScouting(playerId: string): void {
    const state = store.getState() as unknown as RootState;
    const { players } = state.players;
    const { scouts } = state.scouting;
    const treasury = state.treasury;

    const player = players.find((p: Player) => p.id === playerId);
    if (!player) {
      throw new Error('השחקן לא נמצא');
    }

    if (player.isDiscovered) {
      throw new Error('השחקן כבר התגלה');
    }

    // בדיקה אם יש סקאוט פנוי
    const availableScout = scouts.find((s: Scout) => !s.currentMission);
    if (!availableScout) {
      throw new Error('אין סקאוט פנוי');
    }

    // עלות הסקאוטינג
    const scoutingCost = this.calculateScoutingCost(player);
    if (treasury.balance < scoutingCost) {
      throw new Error('אין מספיק תקציב לסקאוטינג');
    }

    store.dispatch(updateTreasury({ balance: treasury.balance - scoutingCost }));

    // עדכון השחקן כמגולה
    store.dispatch(updatePlayer({
      id: player.id,
      changes: {
        isDiscovered: true,
        scoutingProgress: 0
      }
    }));
  }

  private calculateScoutingCost(player: Player): number {
    const basePrice = 5000;
    const ageMultiplier = player.age < 23 ? 1.5 : 1;
    const potentialMultiplier = 1.2; // יש להחליף עם חישוב אמיתי של פוטנציאל
    return Math.floor(basePrice * ageMultiplier * potentialMultiplier);
  }

  startScoutingMission(countryId: string, duration: number = 30): void {
    const state = store.getState() as unknown as RootState;
    const country = countries.find(c => c.id === countryId);
    
    if (!country) throw new Error('מדינה לא נמצאה');
    
    const missionCost = country.scoutingCost * (duration / 30);
    
    if (state.treasury.balance >= missionCost) {
      this.scoutingMissions.set(countryId, {
        country,
        progress: 0,
        remainingDays: duration
      });
      
      store.dispatch(updateTreasury({ balance: state.treasury.balance - missionCost }));
    } else {
      throw new Error('אין מספיק תקציב למשימת סקאוטינג');
    }
  }

  updateScoutingMissions(): void {
    this.scoutingMissions.forEach((mission, countryId) => {
      mission.remainingDays--;
      mission.progress = ((30 - mission.remainingDays) / 30) * 100;

      if (mission.remainingDays <= 0) {
        this.completeMission(countryId, mission.country);
      }
    });
  }

  private completeMission(countryId: string, country: Country): void {
    // מייצר 3-5 שחקנים מהמדינה
    const playerCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < playerCount; i++) {
      const position = this.getRandomPositionWithBonus(country);
      const player = playerGenerator.generatePlayer({
        position
      });

      store.dispatch(addPlayer({
        ...player,
        nationality: country.code
      }));
    }

    this.scoutingMissions.delete(countryId);
  }

  private getRandomPositionWithBonus(country: Country): Position {
    const specialtyChance = 0.6; // 60% סיכוי לקבל שחקן בתפקיד ההתמחות
    
    if (Math.random() < specialtyChance) {
      return country.specialties[Math.floor(Math.random() * country.specialties.length)];
    }
    
    return this.generateRandomPosition();
  }

  private generateRandomPosition(): Position {
    const positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  hireScout(scout: Scout): void {
    const state = store.getState() as unknown as RootState;
    const salary = scout.salary * 12; // עלות שנתית
    if (state.treasury.balance >= salary) {
      this.scouts.set(scout.id, scout);
      store.dispatch(updateTreasury({ balance: state.treasury.balance - salary }));
    } else {
      throw new Error('אין מספיק תקציב לגיוס סקאוט');
    }
  }

  assignScoutToMission(scoutId: string, countryId: string, duration: number): void {
    const scout = this.scouts.get(scoutId);
    if (!scout) throw new Error('סקאוט לא נמצא');

    const country = countries.find(c => c.id === countryId);
    if (!country) throw new Error('מדינה לא נמצאה');

    // בונוסים לסקאוט במדינות המועדפות
    const isPreferredCountry = scout.preferredCountries.includes(countryId);
    const efficiencyBonus = isPreferredCountry ? 1.2 : 1;

    // משפיע על איכות השחקנים שימצאו
    const discoveryBonus = (scout.level * 0.1) + (scout.abilities.evaluation * 0.005);

    this.startScoutingMission(countryId, duration);
  }

  private generatePlayersWithScout(scout: Scout, country: Country, count: number): void {
    for (let i = 0; i < count; i++) {
      const position = this.getRandomPositionWithBonus(country);
      const baseRating = this.calculateBaseRating(country, scout);
      
      const player = playerGenerator.generatePlayer({
        position
      });

      store.dispatch(addPlayer({
        ...player,
        nationality: country.code
      }));
    }
  }

  private calculateBaseRating(country: Country, scout: Scout): number {
    const baseMin = country.baseRatingRange.min;
    const baseMax = country.baseRatingRange.max;
    const scoutBonus = scout.level * 2;
    
    return Math.floor(
      baseMin + 
      (baseMax - baseMin) * (scout.abilities.evaluation / 100) +
      scoutBonus
    );
  }

  updateScoutingProgress() {
    const state = store.getState() as unknown as RootState;
    const { players } = state.players;
    
    players.forEach(player => {
      if (player.scoutingProgress !== undefined && player.scoutingProgress < 100) {
        const progress = Math.min(100, player.scoutingProgress + 10);
        store.dispatch(updatePlayer({ 
          id: player.id, 
          changes: { 
            scoutingProgress: progress 
          } 
        }));
      }
    });
  }

  async payMonthlySalaries() {
    const totalSalaries = this.calculateMonthlySalaries();
    const state = store.getState() as unknown as RootState;
    
    if (state.treasury.balance < totalSalaries.total) {
      return {
        success: false,
        message: 'אין מספיק כסף לתשלום משכורות',
        missing: totalSalaries.total - state.treasury.balance
      };
    }

    store.dispatch(updateTreasury({ balance: state.treasury.balance - totalSalaries.total }));
    const payment: SalaryPayment = {
      date: new Date().toISOString(),
      amount: totalSalaries.total,
      scoutId: 'all',
      type: 'SCOUT_SALARY'
    };
    store.dispatch(addSalaryPayment(payment));

    return {
      success: true,
      message: 'המשכורות שולמו בהצלחה',
      totalSalaries: totalSalaries.total,
      details: totalSalaries.details
    };
  }

  calculateMonthlySalaries(): { total: number, details: { [key: string]: number } } {
    let total = 0;
    const details: { [key: string]: number } = {};

    this.scouts.forEach((scout, id) => {
      details[id] = scout.salary;
      total += scout.salary;
    });

    return { total, details };
  }
}

export const scoutingService = new ScoutingService(); 