import store from '../store';
import { TransferOffer, MarketTrend, CompletedTransfer } from '../types/transfers';
import { Player, PlayerPosition } from '../types/player';

interface TransferAnalysis {
  recommendedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  marketTrend: 'UP' | 'DOWN' | 'STABLE';
  successProbability: number;
  similarDeals: CompletedTransfer[];
  recommendations: string[];
}

export class TransferAnalytics {
  static analyzeTransfer(player: Player, offer: TransferOffer): TransferAnalysis {
    const marketData = this.getMarketData(player.position);
    const similarDeals = this.findSimilarDeals(player);
    const recommendedPrice = this.calculateRecommendedPrice(player, marketData, similarDeals);
    const priceRange = this.calculatePriceRange(recommendedPrice, marketData);
    const successProbability = this.calculateSuccessProbability(offer, recommendedPrice, player);
    
    return {
      recommendedPrice,
      priceRange,
      marketTrend: this.determineMarketTrend(marketData),
      successProbability,
      similarDeals,
      recommendations: this.generateRecommendations(offer, recommendedPrice, player, marketData)
    };
  }

  static getMarketData(position: PlayerPosition): MarketTrend {
    const { marketTrends } = store.getState().transfers.market;
    return marketTrends.find((trend: MarketTrend) => trend.position === position) || {
      position,
      averagePrice: 0,
      numberOfTransfers: 0,
      priceChange: 0,
      timestamp: new Date().toISOString()
    };
  }

  private static findSimilarDeals(player: Player): CompletedTransfer[] {
    const { completedTransfers } = store.getState().transfers.market;
    const ageRange = 2;
    const valueRange = 0.2;

    return completedTransfers.filter((transfer: CompletedTransfer) => {
      const transferPlayer = store.getState().players.players.find((p: Player) => p.id === transfer.playerId);
      if (!transferPlayer) return false;

      const isAgeMatch = Math.abs(transferPlayer.age - player.age) <= ageRange;
      const isValueMatch = Math.abs(transfer.amount - player.value) <= player.value * valueRange;
      const isPositionMatch = transferPlayer.position === player.position;

      return isAgeMatch && isValueMatch && isPositionMatch;
    }).slice(0, 5);
  }

  private static calculateRecommendedPrice(
    player: Player,
    marketData: MarketTrend,
    similarDeals: CompletedTransfer[]
  ): number {
    // חישוב מחיר מומלץ בהתבסס על:
    // 1. שווי השחקן
    // 2. מגמות שוק
    // 3. עסקאות דומות
    
    const baseValue = player.value;
    const marketAdjustment = baseValue * (marketData.priceChange / 100);
    
    const similarDealsAverage = similarDeals.length > 0
      ? similarDeals.reduce((sum, deal) => sum + deal.amount, 0) / similarDeals.length
      : baseValue;

    // משקולות לכל גורם
    const weights = {
      baseValue: 0.4,
      marketTrend: 0.3,
      similarDeals: 0.3
    };

    return (
      baseValue * weights.baseValue +
      (baseValue + marketAdjustment) * weights.marketTrend +
      similarDealsAverage * weights.similarDeals
    );
  }

  private static calculatePriceRange(
    recommendedPrice: number,
    marketData: MarketTrend
  ): { min: number; max: number } {
    // טווח מחירים בהתבסס על תנודתיות השוק
    const volatility = Math.abs(marketData.priceChange) / 100;
    const range = Math.max(0.1, volatility); // מינימום 10% טווח

    return {
      min: recommendedPrice * (1 - range),
      max: recommendedPrice * (1 + range)
    };
  }

  private static calculateSuccessProbability(
    offer: TransferOffer,
    recommendedPrice: number,
    player: Player
  ): number {
    // חישוב הסתברות להצלחת העסקה בהתבסס על:
    // 1. פער מהמחיר המומלץ
    // 2. דחיפות המכירה
    // 3. מצב השחקן
    
    const priceDifference = (offer.currentOffer - recommendedPrice) / recommendedPrice;
    const priceScore = priceDifference > 0 ? 0.8 : Math.max(0.2, 1 + priceDifference);

    const daysUntilExpiry = Math.ceil(
      (new Date(offer.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const urgencyScore = Math.min(1, daysUntilExpiry / 7); // ציון גבוה יותר לזמן ארוך יותר

    const playerScore = player.form ? player.form / 100 : 0.5;

    // משקולות לכל גורם
    return (priceScore * 0.6 + urgencyScore * 0.2 + playerScore * 0.2) * 100;
  }

  private static determineMarketTrend(marketData: MarketTrend): 'UP' | 'DOWN' | 'STABLE' {
    if (marketData.priceChange > 5) return 'UP';
    if (marketData.priceChange < -5) return 'DOWN';
    return 'STABLE';
  }

  private static generateRecommendations(
    offer: TransferOffer,
    recommendedPrice: number,
    player: Player,
    marketData: MarketTrend
  ): string[] {
    const recommendations: string[] = [];

    // המלצות מחיר
    if (offer.currentOffer < recommendedPrice * 0.9) {
      recommendations.push('המחיר המוצע נמוך משמעותית מהשווי המוערך. מומלץ להגיש הצעה נגדית.');
    } else if (offer.currentOffer > recommendedPrice * 1.1) {
      recommendations.push('המחיר המוצע גבוה מהשווי המוערך. כדאי לשקול לקבל את ההצעה.');
    }

    // המלצות עיתוי
    if (marketData.priceChange < -10) {
      recommendations.push('מחירי השוק בירידה. כדאי לשקול לחכות להתייצבות.');
    } else if (marketData.priceChange > 10) {
      recommendations.push('מחירי השוק בעלייה. זה זמן טוב למכור.');
    }

    // המלצות תנאים
    if (offer.conditions.length === 0) {
      recommendations.push('כדאי להוסיף תנאים נוספים להעברה (בונוסים, אחוזי מכירה עתידית).');
    }

    // המלצות מו"מ
    if (offer.counterOffers.length === 0) {
      recommendations.push('טרם הוגשה הצעה נגדית. מומלץ לנהל משא ומתן.');
    }

    return recommendations;
  }
}

// ייצוא פונקציות עזר שימושיות
export const getTransferAnalysis = (player: Player, offer: TransferOffer) => {
  return TransferAnalytics.analyzeTransfer(player, offer);
};

export const getMarketInsights = (position: PlayerPosition) => {
  return TransferAnalytics.getMarketData(position);
}; 
