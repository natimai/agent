import store from '../store';
import { 
  updateGameDate, 
  setGameSpeed, 
  setPaused, 
  updateTreasury, 
  addMonthlyReport,
  addGameEvent
} from '../store/slices/gameSlice';
import { updatePlayer } from '../store/slices/playersSlice';
import { scoutingService } from './scoutingService';
import { eventSystem } from './eventSystem';
import { saveManager } from './saveManager';
import { GameSpeed } from '../types/game';
import { OFFICE_LEVELS } from '../types/office';
import { Player } from '../types/player';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomEvent } from './officeEventsManager';
import { MonthlyReport } from '../types/office';

class GameTimeManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private currentDate: Date;
  private gameSpeed: GameSpeed;
  private isPaused: boolean;
  private readonly TICK_INTERVAL = 1000; // מילישניות בין כל טיק
  private readonly BASE_RENT = 5000; // שכר דירה בסיסי
  private readonly UTILITIES_COST = 1000; // עלויות שוטפות בסיסיות

  constructor() {
    const state = store.getState();
    this.currentDate = new Date(state.game.currentDate);
    this.gameSpeed = state.game.gameSpeed;
    this.isPaused = state.game.isPaused;
  }

  private isFirstDayOfMonth(date: Date): boolean {
    return date.getDate() === 1;
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 5 || day === 6; // יום שישי או שבת
  }

  public async advanceOneDay() {
    const nextDate = new Date(this.currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    this.currentDate = nextDate;

    // עדכון התאריך ב-store
    store.dispatch(updateGameDate(this.currentDate.toISOString()));

    // בדיקה אם זה היום הראשון בחודש
    if (this.isFirstDayOfMonth(this.currentDate)) {
      await this.handleMonthlyEvents();
    }

    // בדיקה אם זה סוף שבוע
    if (this.isWeekend(this.currentDate)) {
      await this.handleWeekendEvents();
    }

    // עדכון התקדמות הסקאוטינג
    await scoutingService.updateScoutingProgress();

    // בדיקת אירועים
    await eventSystem.checkForEvents(this.currentDate);

    // שמירה אוטומטית כל 7 ימים
    if (this.currentDate.getDate() % 7 === 0) {
      saveManager.saveGame();
    }
  }

  private async handleMonthlyEvents() {
    const state = store.getState();
    const expenses: { [key: string]: number } = {};
    const income: { [key: string]: number } = {};
    
    // חישוב שכר דירה לפי רמת המשרד
    const officeLevel = state.office.level;
    const rentCost = this.BASE_RENT * Math.pow(1.5, officeLevel - 1);
    expenses['שכר דירה'] = rentCost;

    // עלויות שוטפות (חשמל, מים, אינטרנט וכו')
    const utilitiesCost = this.UTILITIES_COST * Math.pow(1.2, officeLevel - 1);
    expenses['הוצאות שוטפות'] = utilitiesCost;

    // משכורות סקאוטים
    const salaryResult = await scoutingService.payMonthlySalaries();
    if (salaryResult.totalSalaries) {
      expenses['משכורות סקאוטים'] = salaryResult.totalSalaries;
    }

    // חישוב הכנסות
    // TODO: להוסיף הכנסות מעמלות העברות ועוד

    // חישוב סך הכל הוצאות והכנסות
    const totalExpenses = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);
    const totalIncome = Object.values(income).reduce((sum, amount) => sum + amount, 0);
    const balance = totalIncome - totalExpenses;

    // עדכון האוצר
    store.dispatch(updateTreasury(-totalExpenses + totalIncome));

    // הוספת דוח חודשי
    store.dispatch(addMonthlyReport({
      date: this.currentDate.toISOString(),
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      details: {
        income,
        expenses
      }
    }));

    // בדיקת מצב כספי
    const currentTreasury = state.game.treasury - totalExpenses + totalIncome;
    if (currentTreasury < 0) {
      // TODO: להוסיף טיפול במצב של פשיטת רגל
      console.warn('אזהרה: המאזן שלילי!');
    }
  }

  private async handleWeekendEvents() {
    const state = store.getState();
    const players = state.players.players;
    
    // עדכון משחקים לשחקנים
    for (const player of players) {
      if (this.shouldPlayerPlay(player)) {
        const matchResult = this.generateMatchResult(player);
        
        // עדכון סטטיסטיקות השחקן
        this.updatePlayerStats(player, matchResult);
        
        // יצירת אירוע משחק
        store.dispatch(addGameEvent({
          id: uuidv4(),
          type: 'MATCH_RESULT',
          date: this.currentDate.toISOString(),
          description: this.generateMatchDescription(player, matchResult),
          isHandled: false,
          data: {
            player,
            ...matchResult
          }
        }));

        // עדכון ערך השחקן בהתאם לביצועים
        this.updatePlayerValue(player, matchResult);
      }
    }

    // אירועי פציעות
    this.handleInjuries(players);
  }

  private shouldPlayerPlay(player: Player): boolean {
    // 80% סיכוי למשחק בסוף שבוע
    return Math.random() < 0.8 && !player.isInjured;
  }

  private generateMatchResult(player: Player) {
    const opponent = this.generateRandomOpponent();
    const minutesPlayed = this.generateMinutesPlayed();
    const rating = this.calculateMatchRating(player);
    
    return {
      opponent,
      result: this.generateMatchScore(),
      stats: {
        minutesPlayed,
        goals: this.calculateGoals(player, minutesPlayed, rating),
        assists: this.calculateAssists(player, minutesPlayed, rating),
        rating
      }
    };
  }

  private generateRandomOpponent(): string {
    const opponents = [
      'מכבי חיפה',
      'הפועל באר שבע',
      'מכבי תל אביב',
      'בית"ר ירושלים',
      'הפועל תל אביב',
      'מכבי נתניה'
    ];
    return opponents[Math.floor(Math.random() * opponents.length)];
  }

  private generateMinutesPlayed(): number {
    // 70% סיכוי למשחק מלא
    return Math.random() < 0.7 ? 90 : Math.floor(Math.random() * 90);
  }

  private calculateMatchRating(player: Player): number {
    const baseRating = 6.5;
    const potentialBonus = (player.potential - 70) / 100;
    const randomFactor = (Math.random() - 0.5) * 2; // -1 עד 1
    
    return Math.min(10, Math.max(4, baseRating + potentialBonus + randomFactor));
  }

  private calculateGoals(player: Player, minutes: number, rating: number): number {
    if (player.position.main === 'ST') {
      // חלוץ - סיכוי גבוה יותר לשער
      return this.calculateScoringChance(0.3, minutes, rating);
    } else if (['CAM', 'LW', 'RW'].includes(player.position.main)) {
      // קישור התקפי/כנפיים - סיכוי בינוני
      return this.calculateScoringChance(0.15, minutes, rating);
    } else if (['CM', 'CDM'].includes(player.position.main)) {
      // קישור - סיכוי נמוך
      return this.calculateScoringChance(0.05, minutes, rating);
    }
    // הגנה ושוער - סיכוי נמוך מאוד
    return this.calculateScoringChance(0.01, minutes, rating);
  }

  private calculateAssists(player: Player, minutes: number, rating: number): number {
    if (['CAM', 'LW', 'RW'].includes(player.position.main)) {
      // קישור התקפי/כנפיים - סיכוי גבוה
      return this.calculateScoringChance(0.25, minutes, rating);
    } else if (['CM', 'ST'].includes(player.position.main)) {
      // קישור/חלוץ - סיכוי בינוני
      return this.calculateScoringChance(0.15, minutes, rating);
    }
    // שאר התפקידים - סיכוי נמוך
    return this.calculateScoringChance(0.05, minutes, rating);
  }

  private calculateScoringChance(baseChance: number, minutes: number, rating: number): number {
    const minutesFactor = minutes / 90;
    const ratingFactor = (rating - 6) / 4; // נרמול הדירוג ל-0 עד 1
    const totalChance = baseChance * minutesFactor * (1 + ratingFactor);
    
    // הגרלת מספר אירועים לפי התפלגות פואסון
    return this.poissonRandom(totalChance);
  }

  private poissonRandom(lambda: number): number {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    return k - 1;
  }

  private generateMatchScore(): string {
    const homeGoals = Math.floor(Math.random() * 4);
    const awayGoals = Math.floor(Math.random() * 4);
    return `${homeGoals}-${awayGoals}`;
  }

  private updatePlayerStats(player: Player, matchResult: any) {
    const { stats } = matchResult;
    const state = store.getState();
    const updatedPlayer = { ...player };
    
    // עדכון סטטיסטיקות מצטברות
    updatedPlayer.stats = {
      goals: player.stats.goals + stats.goals,
      assists: player.stats.assists + stats.assists,
      appearances: player.stats.appearances + 1,
      minutesPlayed: player.stats.minutesPlayed + stats.minutesPlayed,
      totalRating: player.stats.totalRating + stats.rating,
      averageRating: ((player.stats.totalRating + stats.rating) / (player.stats.appearances + 1))
    };

    // שמירת המשחק האחרון
    updatedPlayer.lastMatch = {
      date: this.currentDate.toISOString(),
      opponent: matchResult.opponent,
      result: matchResult.result,
      stats: {
        minutesPlayed: stats.minutesPlayed,
        goals: stats.goals,
        assists: stats.assists,
        rating: stats.rating
      }
    };

    // עדכון השחקן ב-store
    store.dispatch(updatePlayer(updatedPlayer));
  }

  private updatePlayerValue(player: Player, matchResult: any) {
    const { stats } = matchResult;
    const state = store.getState();
    const updatedPlayer = { ...player };
    
    // חישוב שינוי בערך השחקן
    let valueChange = 0;

    // בונוס על שערים
    if (stats.goals > 0) {
      valueChange += stats.goals * 50000; // 50,000₪ לכל שער
    }

    // בונוס על בישולים
    if (stats.assists > 0) {
      valueChange += stats.assists * 30000; // 30,000₪ לכל בישול
    }

    // בונוס/קנס על ציון המשחק
    const ratingImpact = (stats.rating - 6.5) * 100000; // 100,000₪ לכל נקודת ציון מעל/מתחת ל-6.5
    valueChange += ratingImpact;

    // התאמה לפי גיל
    if (player.age < 23) {
      valueChange *= 1.5; // שחקנים צעירים מקבלים בונוס גדול יותר
    } else if (player.age > 30) {
      valueChange *= 0.5; // שחקנים מבוגרים מקבלים בונוס קטן יותר
    }

    // עדכון הערך המינימלי והמקסימלי
    const minValue = 100000; // ערך מינימלי של 100,000₪
    const maxValue = 50000000; // ערך מקסימלי של 50,000,000₪
    
    updatedPlayer.value = Math.max(minValue, Math.min(maxValue, player.value + valueChange));

    // עדכון השחקן ב-store
    store.dispatch(updatePlayer(updatedPlayer));
  }

  private handleInjuries(players: Player[]) {
    for (const player of players) {
      // 5% סיכוי לפציעה בכל משחק
      if (Math.random() < 0.05 && !player.isInjured) {
        const injury = this.generateInjury();
        
        store.dispatch(addGameEvent({
          id: uuidv4(),
          type: 'INJURY',
          date: this.currentDate.toISOString(),
          description: `${player.name} נפצע ויעדר ל-${injury.durationDays} ימים`,
          isHandled: false,
          data: {
            player,
            type: injury.type,
            durationDays: injury.durationDays
          }
        }));
      }
    }
  }

  private generateInjury() {
    const types = ['Minor', 'Medium', 'Severe'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    
    const durationDays = {
      'Minor': 3 + Math.floor(Math.random() * 7),
      'Medium': 7 + Math.floor(Math.random() * 14),
      'Severe': 21 + Math.floor(Math.random() * 60)
    }[type];

    return { type, durationDays };
  }

  private generateMatchDescription(player: Player, matchResult: any): string {
    const { opponent, result, stats } = matchResult;
    let description = `${player.name} שיחק ${stats.minutesPlayed} דקות מול ${opponent} (${result})`;
    
    if (stats.goals > 0) {
      description += `, כבש ${stats.goals} שערים`;
    }
    if (stats.assists > 0) {
      description += `, בישל ${stats.assists} שערים`;
    }
    
    description += `. ציון: ${stats.rating.toFixed(1)}`;
    return description;
  }

  public async advanceOneWeek() {
    for (let i = 0; i < 7; i++) {
      await this.advanceOneDay();
      // הוספת השהייה קטנה בין הימים למניעת עומס
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  public start() {
    if (this.timer) return;

    const interval = this.TICK_INTERVAL / this.gameSpeed;
    this.timer = setInterval(async () => {
      if (!this.isPaused) {
        await this.advanceOneDay();
      }
    }, interval);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public setSpeed(speed: GameSpeed) {
    this.gameSpeed = speed;
    store.dispatch(setGameSpeed(speed));
    
    // עדכון הטיימר עם המהירות החדשה
    if (this.timer) {
      this.stop();
      this.start();
    }
  }

  public togglePause(isPaused: boolean) {
    this.isPaused = isPaused;
    store.dispatch(setPaused(isPaused));
    
    if (isPaused) {
      this.stop();
    } else {
      this.start();
    }
  }

  public getCurrentDate(): Date {
    return this.currentDate;
  }

  public getGameSpeed(): GameSpeed {
    return this.gameSpeed;
  }

  public isPauseState(): boolean {
    return this.isPaused;
  }
}

const GAME_SPEED = 1000; // מילישניות ליום משחק
let gameInterval: NodeJS.Timeout | null = null;

const generateMonthlyReport = (): MonthlyReport => {
  const state = store.getState();
  const { office, game } = state;
  const currentOffice = office.currentLevel;
  
  // חישוב הכנסות
  const commissions = office.stats.totalCommissions;
  const sponsorships = office.activeSponsors.reduce((total, sponsorId) => {
    const sponsor = office.sponsors.find(s => s.id === sponsorId);
    return total + (sponsor?.monthlyPayment || 0);
  }, 0);
  const bonuses = Math.floor(Math.random() * 10000); // בונוסים אקראיים
  
  // חישוב הוצאות
  const rent = currentOffice.monthlyExpenses;
  const utilities = Math.floor(rent * 0.2);
  const salaries = office.staff.reduce((total, member) => total + member.salary, 0);
  const misc = Math.floor(Math.random() * 5000); // הוצאות שונות אקראיות
  
  // חישוב סטטיסטיקות
  const stats = {
    totalTransfers: office.stats.totalTransfers,
    successfulDeals: office.stats.successfulDeals,
    failedDeals: office.stats.failedDeals,
    activeNegotiations: office.stats.activeNegotiations
  };
  
  const totalIncome = commissions + sponsorships + bonuses;
  const totalExpenses = rent + utilities + salaries + misc;
  const balance = totalIncome - totalExpenses;
  
  return {
    date: new Date().toISOString(),
    income: {
      commissions,
      sponsorships,
      bonuses,
      other: 0
    },
    expenses: {
      rent,
      utilities,
      salaries,
      misc
    },
    balance,
    stats
  };
};

export const startGameTime = (): void => {
  if (gameInterval) return;
  
  let lastMonth = new Date().getMonth();
  
  gameInterval = setInterval(() => {
    const state = store.getState();
    const currentDate = new Date(state.game.currentDate);
    const newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    
    // בדיקה אם עבר חודש
    if (newDate.getMonth() !== lastMonth) {
      const monthlyReport = generateMonthlyReport();
      store.dispatch(addMonthlyReport(monthlyReport));
      lastMonth = newDate.getMonth();
    }
    
    // בדיקה אם צריך לייצר אירוע חדש
    if (Math.random() > 0.95) { // 5% סיכוי ליום
      generateRandomEvent();
    }
    
    store.dispatch(updateGameDate(newDate.toISOString()));
  }, GAME_SPEED);
};

export const stopGameTime = (): void => {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
};

export const setGameSpeed = (speed: number): void => {
  const wasRunning = gameInterval !== null;
  if (wasRunning) {
    stopGameTime();
  }
  
  GAME_SPEED = speed;
  
  if (wasRunning) {
    startGameTime();
  }
};

export const gameTimeManager = new GameTimeManager(); 