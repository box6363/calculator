export type LotteryGameId = 'powerball' | 'megamillions' | 'lottoamerica' | 'custom';

export interface PrizeTier {
  name: string;
  matchWhite: number;
  matchSpecial: boolean;
  prizeUsd: number;
  isJackpot?: boolean;
  standardOddsOneIn: number; // e.g. 292201338
  winningCombinations: number;
}

export interface LotteryGameConfig {
  id: LotteryGameId;
  name: string;
  country: string;
  whiteBallsTotal: number; // e.g. 69
  whiteBallsPick: number;  // e.g. 5
  specialBallsTotal: number; // e.g. 26
  specialBallsPick: number;  // e.g. 1
  specialBallName: string;   // e.g. "Powerball (Bóng đỏ)"
  ticketPriceUsd: number;    // e.g. 2
  defaultJackpotUsd: number; // e.g. 200,000,000
  tiers: PrizeTier[];
  drawDays: string;
}

export interface BaoOption {
  level: number; // e.g. 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 20
  label: string; // e.g. "Bao 7 (Chọn 7 số)"
  combinations: number; // C(M, 5)
  costUsd: number; // combinations * ticketPrice
  description: string;
}

export interface SimulationResult {
  drawWhite: number[];
  drawSpecial: number;
  totalTickets: number;
  totalSpent: number;
  totalWon: number;
  netProfit: number;
  tierCounts: Record<string, number>;
  jackpotWon: boolean;
}
