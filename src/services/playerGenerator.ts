import { Player, PlayerAttributes, Position } from '../types/player';
import { randomFromArray, generateName } from '../utils/generators';
import { calculatePlayerValue } from '../utils/calculations';

class PlayerGenerator {
  private readonly POSITION_WEIGHTS: { [key in Position]: Partial<Record<keyof PlayerAttributes, number>> } = {
    GK: {
      pace: 0.3,
      shooting: 0.1,
      passing: 0.6,
      dribbling: 0.3,
      defending: 0.9,
      physical: 0.7
    },
    CB: {
      pace: 0.6,
      shooting: 0.2,
      passing: 0.5,
      dribbling: 0.4,
      defending: 1,
      physical: 0.9
    },
    LB: {
      pace: 0.8,
      shooting: 0.3,
      passing: 0.7,
      dribbling: 0.6,
      defending: 0.8,
      physical: 0.7
    },
    RB: {
      pace: 0.8,
      shooting: 0.3,
      passing: 0.7,
      dribbling: 0.6,
      defending: 0.8,
      physical: 0.7
    },
    CDM: {
      pace: 0.6,
      shooting: 0.4,
      passing: 0.8,
      dribbling: 0.6,
      defending: 0.9,
      physical: 0.8
    },
    CM: {
      pace: 0.7,
      shooting: 0.6,
      passing: 0.9,
      dribbling: 0.7,
      defending: 0.6,
      physical: 0.7
    },
    CAM: {
      pace: 0.7,
      shooting: 0.8,
      passing: 0.9,
      dribbling: 0.9,
      defending: 0.4,
      physical: 0.5
    },
    LW: {
      pace: 0.9,
      shooting: 0.8,
      passing: 0.7,
      dribbling: 0.9,
      defending: 0.3,
      physical: 0.5
    },
    RW: {
      pace: 0.9,
      shooting: 0.8,
      passing: 0.7,
      dribbling: 0.9,
      defending: 0.3,
      physical: 0.5
    },
    ST: {
      pace: 0.8,
      shooting: 1,
      passing: 0.6,
      dribbling: 0.8,
      defending: 0.2,
      physical: 0.8
    }
  };

  generatePlayer(options: {
    position?: Position;
    ageRange?: { min: number; max: number };
    minRating?: number;
    maxRating?: number;
  } = {}): Player {
    const position = options.position || this.generateRandomPosition();
    const age = this.generateAge(options.ageRange);
    const attributes = this.generateAttributes(position, options.minRating, options.maxRating);
    const potential = this.calculatePotential(age, attributes);

    return {
      id: Date.now().toString(),
      name: generateName(),
      age,
      nationality: this.generateNationality(),
      position: {
        main: position,
        secondary: this.generateSecondaryPositions(position)
      },
      attributes,
      potential,
      currentAbility: this.calculateCurrentAbility(attributes),
      contract: this.generateContract(age, attributes),
      value: calculatePlayerValue({
        age,
        attributes,
        potential
      }),
      isDiscovered: false
    };
  }

  private generateAttributes(
    position: Position,
    minRating = 50,
    maxRating = 85
  ): PlayerAttributes {
    const weights = this.POSITION_WEIGHTS[position];
    const baseRating = Math.floor(Math.random() * (maxRating - minRating) + minRating);

    return {
      pace: this.generateAttributeValue(baseRating, weights.pace),
      shooting: this.generateAttributeValue(baseRating, weights.shooting),
      passing: this.generateAttributeValue(baseRating, weights.passing),
      dribbling: this.generateAttributeValue(baseRating, weights.dribbling),
      defending: this.generateAttributeValue(baseRating, weights.defending),
      physical: this.generateAttributeValue(baseRating, weights.physical)
    };
  }

  private generateAttributeValue(baseRating: number, weight = 1): number {
    const variance = Math.floor(Math.random() * 10) - 5;
    const weightedRating = baseRating * weight;
    return Math.max(1, Math.min(99, Math.floor(weightedRating + variance)));
  }

  private calculatePotential(age: number, attributes: PlayerAttributes): number {
    const currentAbility = this.calculateCurrentAbility(attributes);
    const potentialGrowth = Math.max(0, 25 - (age - 16) * 1.5);
    return Math.min(99, currentAbility + potentialGrowth);
  }

  private calculateCurrentAbility(attributes: PlayerAttributes): number {
    return Math.floor(
      Object.values(attributes).reduce((sum, value) => sum + value, 0) / 6
    );
  }

  private generateAge(range?: { min: number; max: number }): number {
    const min = range?.min || 16;
    const max = range?.max || 35;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private generateContract(age: number, attributes: PlayerAttributes): PlayerContract {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + Math.floor(Math.random() * 3) + 1);

    const baseSalary = this.calculateBaseSalary(age, attributes);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      salary: baseSalary,
      releaseClause: baseSalary * 12 * (Math.random() * 2 + 2)
    };
  }

  private calculateBaseSalary(age: number, attributes: PlayerAttributes): number {
    const averageRating = this.calculateCurrentAbility(attributes);
    const baseValue = 1000 + Math.pow(averageRating, 2) * 10;
    const ageMultiplier = age < 24 ? 0.8 : age > 30 ? 0.6 : 1;
    return Math.floor(baseValue * ageMultiplier);
  }

  private generateRandomPosition(): Position {
    const positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  private generateSecondaryPositions(mainPosition: Position): Position[] {
    const positionMap: { [key in Position]: Position[] } = {
      'GK': [],
      'CB': ['CDM'],
      'LB': ['LW', 'CB'],
      'RB': ['RW', 'CB'],
      'CDM': ['CM', 'CB'],
      'CM': ['CAM', 'CDM'],
      'CAM': ['CM', 'ST', 'LW', 'RW'],
      'LW': ['CAM', 'ST'],
      'RW': ['CAM', 'ST'],
      'ST': ['CAM', 'LW', 'RW']
    };

    const possiblePositions = positionMap[mainPosition];
    const count = Math.floor(Math.random() * Math.min(2, possiblePositions.length));
    return possiblePositions.slice(0, count);
  }

  private generateNationality(): string {
    const countries = ['ישראל', 'ספרד', 'אנגליה', 'גרמניה', 'צרפת', 'איטליה'];
    return randomFromArray(countries);
  }
}

export const playerGenerator = new PlayerGenerator(); 