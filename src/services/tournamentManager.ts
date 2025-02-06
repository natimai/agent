import store from '../store';
import { YouthTournament } from '../types/youthTournament';
import { Scout } from '../types/scout';
import { Country } from '../types/country';
import { Player } from '../types/player';
import { addTournament, updateTournament } from '../store/slices/scoutingSlice';
import { playerGenerator } from './playerGenerator';
import { addPlayer } from '../store/slices/playersSlice';

class TournamentManager {
  private readonly TOURNAMENT_DURATION = 14; // ימים
  private activeTournaments: Map<string, YouthTournament> = new Map();

  createTournament(scout: Scout, country: Country): YouthTournament {
    const tournament: YouthTournament = {
      id: Date.now().toString(),
      name: this.generateTournamentName(country),
      countryId: country.id,
      startDate: new Date().toISOString(),
      duration: this.TOURNAMENT_DURATION,
      level: this.generateTournamentLevel(scout),
      teamsCount: this.generateTeamsCount(),
      prospects: this.generateProspects(country, scout),
      accessCost: this.calculateAccessCost()
    };

    store.dispatch(addTournament(tournament));
    this.activeTournaments.set(tournament.id, tournament);
    return tournament;
  }

  private generateTournamentName(country: Country): string {
    const types = ['גביע', 'טורניר', 'אליפות'];
    const categories = ['נוער', 'צעירים', 'עתודה'];
    const regions = ['מחוזי', 'ארצי', 'בינלאומי'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    
    return `${type} ${category} ${region} - ${country.name}`;
  }

  private generateTournamentLevel(scout: Scout): 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL' {
    const roll = Math.random() * (100 + scout.abilities.youth) / 100;
    if (roll < 0.6) return 'REGIONAL';
    if (roll < 0.9) return 'NATIONAL';
    return 'INTERNATIONAL';
  }

  private generateTeamsCount(): number {
    const possibleCounts = [8, 16, 24];
    return possibleCounts[Math.floor(Math.random() * possibleCounts.length)];
  }

  private generateProspects(country: Country, scout: Scout): YouthTournament['prospects'] {
    const count = 3 + Math.floor(Math.random() * 4);
    const prospects: YouthTournament['prospects'] = [];

    for (let i = 0; i < count; i++) {
      const player = playerGenerator.generatePlayer({
        position: this.generateRandomPosition(),
        ageRange: { min: 15, max: 19 },
        minRating: this.calculateProspectMinRating(scout),
        maxRating: this.calculateProspectMaxRating(scout)
      });

      // עדכון נוסף של השחקן אחרי היצירה
      const updatedPlayer = {
        ...player,
        nationality: country.code,
        name: country.playerNameGenerator(),
        potential: player.potential + this.calculatePotentialBonus(scout)
      };

      store.dispatch(addPlayer(updatedPlayer));

      prospects.push({
        playerId: updatedPlayer.id,
        potential: updatedPlayer.potential,
        observationCost: this.calculateObservationCost()
      });
    }

    return prospects;
  }

  private generateRandomPosition(): Position {
    const positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  private calculateProspectMinRating(scout: Scout): number {
    return 60 + Math.floor((scout.abilities.youth / 100) * 5);
  }

  private calculateProspectMaxRating(scout: Scout): number {
    return 70 + Math.floor((scout.abilities.youth / 100) * 10);
  }

  private calculatePotentialBonus(scout: Scout): number {
    return 15 + Math.floor((scout.abilities.youth / 100) * 10);
  }

  private calculateAccessCost(): number {
    return 12000 + Math.floor(Math.random() * 8000);
  }

  private calculateObservationCost(): number {
    return 2000 + Math.floor(Math.random() * 3000);
  }

  updateTournaments(currentDate: Date) {
    this.activeTournaments.forEach((tournament, id) => {
      const startDate = new Date(tournament.startDate);
      const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysElapsed >= tournament.duration) {
        this.completeTournament(tournament);
        this.activeTournaments.delete(id);
      }
    });
  }

  private completeTournament(tournament: YouthTournament) {
    // עדכון הערכות והתקדמות של השחקנים
    tournament.prospects.forEach(prospect => {
      const player = store.getState().players.players.find(p => p.id === prospect.playerId);
      if (player) {
        this.updatePlayerAfterTournament(player);
      }
    });
  }

  private updatePlayerAfterTournament(player: Player) {
    // הגדלת דירוג ופוטנציאל בהתאם לביצועים בטורניר
    const ratingIncrease = Math.floor(Math.random() * 3);
    const potentialIncrease = Math.floor(Math.random() * 2);
    
    // TODO: עדכון השחקן במערכת
  }
}

export const tournamentManager = new TournamentManager(); 