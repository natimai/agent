import store from '../store';
import { Player } from '../types/player';
import { playerGenerator } from './playerGenerator';
import { addPlayer, updatePlayer } from '../store/slices/playersSlice';
import { updateTreasury } from '../store/slices/gameSlice';
import { Country } from '../data/countries';
import { Position } from '../types/position';
import { Scout } from '../types/scout';
import { countries } from '../data/countries';
import { addScout, updateScoutProgress, payMonthlySalaries } from '../store/slices/scoutingSlice';
import { addSalaryPayment } from '../store/slices/gameSlice';

class ScoutingService {
  private readonly BASE_SCOUTING_TIME = 7; // ימים בסיס
  private scoutingMissions: Map<string, {
    country: Country;
    progress: number;
    remainingDays: number;
  }> = new Map();

  private scouts: Map<string, Scout> = new Map();

  startScoutingMission(countryId: string, duration: number = 30): void {
    const state = store.getState();
    const country = countries.find(c => c.id === countryId);
    
    if (!country) throw new Error('מדינה לא נמצאה');
    
    const missionCost = country.scoutingCost * (duration / 30);
    
    if (state.game.treasury >= missionCost) {
      this.scoutingMissions.set(countryId, {
        country,
        progress: 0,
        remainingDays: duration
      });
      
      store.dispatch(updateTreasury(-missionCost));
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
        position,
        nationality: country.code,
        nameGenerator: country.playerNameGenerator,
        minRating: country.baseRatingRange.min,
        maxRating: country.baseRatingRange.max,
        attributeModifiers: country.style.attributes
      });

      store.dispatch(addPlayer(player));
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

  hireScout(scout: Scout): void {
    const state = store.getState();
    if (state.game.treasury >= scout.cost) {
      this.scouts.set(scout.id, scout);
      store.dispatch(updateTreasury(-scout.cost));
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

    this.startScoutingMission(countryId, duration, {
      scoutId,
      efficiencyBonus,
      discoveryBonus
    });
  }

  private generatePlayersWithScout(scout: Scout, country: Country, count: number): void {
    for (let i = 0; i < count; i++) {
      const position = this.getRandomPositionWithBonus(country);
      const baseRating = this.calculateBaseRating(country, scout);
      
      const player = playerGenerator.generatePlayer({
        position,
        nationality: country.code,
        nameGenerator: country.playerNameGenerator,
        minRating: baseRating - 5,
        maxRating: baseRating + 5,
        attributeModifiers: country.style.attributes
      });

      store.dispatch(addPlayer(player));
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
    const state = store.getState();
    const { scouts } = state.scouting;
    
    scouts.forEach(scout => {
      if (scout.currentMission) {
        const progress = Math.min(100, (scout.scoutingProgress || 0) + this.calculateProgressRate(scout));
        store.dispatch(updateScoutProgress({ scoutId: scout.id, progress }));
      }
    });
  }

  calculateProgressRate(scout: Scout): number {
    return scout.level * 2 + scout.abilities.evaluation * 0.5;
  }

  async payMonthlySalaries() {
    const totalSalaries = this.calculateMonthlySalaries();
    const state = store.getState();
    
    if (state.game.treasury < totalSalaries.total) {
      return {
        success: false,
        message: 'אין מספיק כסף לתשלום משכורות',
        missing: totalSalaries.total - state.game.treasury
      };
    }

    store.dispatch(updateTreasury(-totalSalaries.total));
    store.dispatch(addSalaryPayment({
      date: new Date().toISOString(),
      amount: totalSalaries.total,
      details: totalSalaries.details
    }));

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