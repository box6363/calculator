import { LotteryGameConfig, LotteryGameId, BaoOption } from './types';

// Mathematical combination function C(n, k)
export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const effectiveK = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= effectiveK; i++) {
    result = (result * (n - (effectiveK - i))) / i;
  }
  return Math.round(result);
}

// Format odds helper: e.g. "1 trên 292,201,338"
export function formatOdds(oneIn: number): string {
  if (oneIn <= 1) return '100% (Đảm bảo trúng)';
  if (oneIn > 1e12) return `1 trên ${(oneIn / 1e12).toFixed(2)} nghìn tỷ`;
  if (oneIn > 1e9) return `1 trên ${(oneIn / 1e9).toFixed(2)} tỷ`;
  if (oneIn > 1e6) return `1 trên ${(oneIn / 1e6).toFixed(2)} triệu`;
  return `1 trên ${Math.round(oneIn).toLocaleString('vi-VN')}`;
}

// Pre-configured US lottery games
export const US_LOTTERY_GAMES: Record<LotteryGameId, LotteryGameConfig> = {
  powerball: {
    id: 'powerball',
    name: 'Powerball (Mỹ)',
    country: 'Hoa Kỳ (45 bang + DC, PR, VI)',
    whiteBallsTotal: 69,
    whiteBallsPick: 5,
    specialBallsTotal: 26,
    specialBallsPick: 1,
    specialBallName: 'Powerball (Bóng đỏ)',
    ticketPriceUsd: 2,
    defaultJackpotUsd: 250_000_000,
    drawDays: 'Thứ 2, Thứ 4, Thứ 7 (22:59 ET)',
    tiers: [
      {
        name: 'Jackpot (Giải độc đắc)',
        matchWhite: 5,
        matchSpecial: true,
        prizeUsd: 250_000_000,
        isJackpot: true,
        standardOddsOneIn: 292_201_338,
        winningCombinations: 1
      },
      {
        name: 'Giải Nhất (5 số trắng)',
        matchWhite: 5,
        matchSpecial: false,
        prizeUsd: 1_000_000,
        standardOddsOneIn: 11_688_054,
        winningCombinations: 25
      },
      {
        name: 'Giải Nhì (4 số trắng + PB)',
        matchWhite: 4,
        matchSpecial: true,
        prizeUsd: 50_000,
        standardOddsOneIn: 913_129,
        winningCombinations: 320
      },
      {
        name: 'Giải Ba (4 số trắng)',
        matchWhite: 4,
        matchSpecial: false,
        prizeUsd: 100,
        standardOddsOneIn: 36_525,
        winningCombinations: 8_000
      },
      {
        name: 'Giải Tư (3 số trắng + PB)',
        matchWhite: 3,
        matchSpecial: true,
        prizeUsd: 100,
        standardOddsOneIn: 14_494,
        winningCombinations: 20_160
      },
      {
        name: 'Giải Năm (3 số trắng)',
        matchWhite: 3,
        matchSpecial: false,
        prizeUsd: 7,
        standardOddsOneIn: 580,
        winningCombinations: 504_000
      },
      {
        name: 'Giải Sáu (2 số trắng + PB)',
        matchWhite: 2,
        matchSpecial: true,
        prizeUsd: 7,
        standardOddsOneIn: 701,
        winningCombinations: 416_640
      },
      {
        name: 'Giải Bảy (1 số trắng + PB)',
        matchWhite: 1,
        matchSpecial: true,
        prizeUsd: 4,
        standardOddsOneIn: 92,
        winningCombinations: 3_176_880
      },
      {
        name: 'Giải Tám (Chỉ trúng PB)',
        matchWhite: 0,
        matchSpecial: true,
        prizeUsd: 4,
        standardOddsOneIn: 38,
        winningCombinations: 7_624_512
      }
    ]
  },
  megamillions: {
    id: 'megamillions',
    name: 'Mega Millions (Mỹ)',
    country: 'Hoa Kỳ (45 bang + DC, VI)',
    whiteBallsTotal: 70,
    whiteBallsPick: 5,
    specialBallsTotal: 25,
    specialBallsPick: 1,
    specialBallName: 'Mega Ball (Bóng vàng)',
    ticketPriceUsd: 2,
    defaultJackpotUsd: 200_000_000,
    drawDays: 'Thứ 3, Thứ 6 (23:00 ET)',
    tiers: [
      {
        name: 'Jackpot (Giải độc đắc)',
        matchWhite: 5,
        matchSpecial: true,
        prizeUsd: 200_000_000,
        isJackpot: true,
        standardOddsOneIn: 302_575_350,
        winningCombinations: 1
      },
      {
        name: 'Giải Nhất (5 số trắng)',
        matchWhite: 5,
        matchSpecial: false,
        prizeUsd: 1_000_000,
        standardOddsOneIn: 12_607_306,
        winningCombinations: 24
      },
      {
        name: 'Giải Nhì (4 số trắng + MB)',
        matchWhite: 4,
        matchSpecial: true,
        prizeUsd: 10_000,
        standardOddsOneIn: 931_001,
        winningCombinations: 325
      },
      {
        name: 'Giải Ba (4 số trắng)',
        matchWhite: 4,
        matchSpecial: false,
        prizeUsd: 500,
        standardOddsOneIn: 38_792,
        winningCombinations: 7_800
      },
      {
        name: 'Giải Tư (3 số trắng + MB)',
        matchWhite: 3,
        matchSpecial: true,
        prizeUsd: 200,
        standardOddsOneIn: 14_547,
        winningCombinations: 20_800
      },
      {
        name: 'Giải Năm (3 số trắng)',
        matchWhite: 3,
        matchSpecial: false,
        prizeUsd: 10,
        standardOddsOneIn: 606,
        winningCombinations: 499_200
      },
      {
        name: 'Giải Sáu (2 số trắng + MB)',
        matchWhite: 2,
        matchSpecial: true,
        prizeUsd: 10,
        standardOddsOneIn: 693,
        winningCombinations: 436_800
      },
      {
        name: 'Giải Bảy (1 số trắng + MB)',
        matchWhite: 1,
        matchSpecial: true,
        prizeUsd: 4,
        standardOddsOneIn: 89,
        winningCombinations: 3_388_320
      },
      {
        name: 'Giải Tám (Chỉ trúng MB)',
        matchWhite: 0,
        matchSpecial: true,
        prizeUsd: 2,
        standardOddsOneIn: 37,
        winningCombinations: 8_259_888
      }
    ]
  },
  lottoamerica: {
    id: 'lottoamerica',
    name: 'Lotto America (Mỹ)',
    country: 'Hoa Kỳ (13 bang)',
    whiteBallsTotal: 52,
    whiteBallsPick: 5,
    specialBallsTotal: 10,
    specialBallsPick: 1,
    specialBallName: 'Star Ball (Bóng sao)',
    ticketPriceUsd: 1,
    defaultJackpotUsd: 15_000_000,
    drawDays: 'Thứ 2, Thứ 4, Thứ 7',
    tiers: [
      {
        name: 'Jackpot (Giải độc đắc)',
        matchWhite: 5,
        matchSpecial: true,
        prizeUsd: 15_000_000,
        isJackpot: true,
        standardOddsOneIn: 25_989_600,
        winningCombinations: 1
      },
      {
        name: 'Giải Nhất (5 số trắng)',
        matchWhite: 5,
        matchSpecial: false,
        prizeUsd: 100_000,
        standardOddsOneIn: 2_887_733,
        winningCombinations: 9
      },
      {
        name: 'Giải Nhì (4 số trắng + SB)',
        matchWhite: 4,
        matchSpecial: true,
        prizeUsd: 1_000,
        standardOddsOneIn: 110_594,
        winningCombinations: 235
      },
      {
        name: 'Giải Ba (4 số trắng)',
        matchWhite: 4,
        matchSpecial: false,
        prizeUsd: 100,
        standardOddsOneIn: 12_288,
        winningCombinations: 2_115
      },
      {
        name: 'Giải Tư (3 số trắng + SB)',
        matchWhite: 3,
        matchSpecial: true,
        prizeUsd: 20,
        standardOddsOneIn: 2_404,
        winningCombinations: 10_810
      },
      {
        name: 'Giải Năm (3 số trắng)',
        matchWhite: 3,
        matchSpecial: false,
        prizeUsd: 5,
        standardOddsOneIn: 267,
        winningCombinations: 97_290
      },
      {
        name: 'Giải Sáu (2 số trắng + SB)',
        matchWhite: 2,
        matchSpecial: true,
        prizeUsd: 5,
        standardOddsOneIn: 160,
        winningCombinations: 162_150
      },
      {
        name: 'Giải Bảy (1 số trắng + SB)',
        matchWhite: 1,
        matchSpecial: true,
        prizeUsd: 2.5,
        standardOddsOneIn: 29,
        winningCombinations: 891_825
      },
      {
        name: 'Giải Tám (Chỉ trúng SB)',
        matchWhite: 0,
        matchSpecial: true,
        prizeUsd: 2,
        standardOddsOneIn: 17,
        winningCombinations: 1_533_939
      }
    ]
  },
  custom: {
    id: 'custom',
    name: 'Xổ Số Tùy Chỉnh (Custom Matrix)',
    country: 'Tự cấu hình quy tắc',
    whiteBallsTotal: 69,
    whiteBallsPick: 5,
    specialBallsTotal: 26,
    specialBallsPick: 1,
    specialBallName: 'Bóng Đặc Biệt',
    ticketPriceUsd: 2,
    defaultJackpotUsd: 100_000_000,
    drawDays: 'Tùy chỉnh',
    tiers: [
      {
        name: 'Jackpot (Giải độc đắc)',
        matchWhite: 5,
        matchSpecial: true,
        prizeUsd: 100_000_000,
        isJackpot: true,
        standardOddsOneIn: 292_201_338,
        winningCombinations: 1
      },
      {
        name: 'Giải Nhất (Trúng toàn bộ số chính)',
        matchWhite: 5,
        matchSpecial: false,
        prizeUsd: 1_000_000,
        standardOddsOneIn: 11_688_054,
        winningCombinations: 25
      },
      {
        name: 'Giải Nhì (Trúng 4 số + Bóng đặc biệt)',
        matchWhite: 4,
        matchSpecial: true,
        prizeUsd: 50_000,
        standardOddsOneIn: 913_129,
        winningCombinations: 320
      }
    ]
  }
};

// Available "Bao Số" options
export function generateBaoOptions(ticketPrice: number = 2): BaoOption[] {
  const levels = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20];
  return levels.map(m => {
    const combs = combinations(m, 5);
    const cost = combs * ticketPrice;
    return {
      level: m,
      label: `Bao ${m}`,
      combinations: combs,
      costUsd: cost,
      description: `Chọn ${m} số trắng. Tạo thành ${combs.toLocaleString()} bộ 5 số.`
    };
  });
}

// Calculate total combinations for any game matrix
export function getTotalCombinations(config: LotteryGameConfig): number {
  const whiteCombs = combinations(config.whiteBallsTotal, config.whiteBallsPick);
  const specialCombs = combinations(config.specialBallsTotal, config.specialBallsPick);
  return whiteCombs * specialCombs;
}

// Calculate overall probability of winning any prize for a single ticket
export function getOverallWinningOdds(config: LotteryGameConfig): number {
  const totalCombos = getTotalCombinations(config);
  const totalWinningCombos = config.tiers.reduce((acc, t) => acc + t.winningCombinations, 0);
  return totalCombos / Math.max(1, totalWinningCombos);
}

// Calculate chance of winning at least 1 prize given N tickets
export function calcChanceAtLeastOne(oneInOdds: number, ticketCount: number): number {
  if (ticketCount <= 0) return 0;
  if (oneInOdds <= 1) return 1;
  const pSingle = 1 / oneInOdds;
  // P(at least 1) = 1 - (1 - p)^n
  // For large N and small p, use Math.exp(-n * p) to avoid float precision loss
  const logTerm = Math.log1p(-pSingle);
  const prob = 1 - Math.exp(ticketCount * logTerm);
  return Math.min(1, Math.max(0, prob));
}

// Calculate Expected Value (EV) per ticket
export function calculateExpectedValue(
  config: LotteryGameConfig, 
  customJackpot?: number, 
  applyTax: boolean = true
): { ev: number; evReturnRate: number } {
  const totalCombos = getTotalCombinations(config);
  const taxRate = applyTax ? 0.37 : 0; // US Federal top tax bracket

  let totalExpectedPayout = 0;
  for (const tier of config.tiers) {
    let prize = tier.prizeUsd;
    if (tier.isJackpot && customJackpot) {
      prize = customJackpot;
    }
    // After tax payout
    const netPrize = prize * (1 - taxRate);
    const p = tier.winningCombinations / totalCombos;
    totalExpectedPayout += p * netPrize;
  }

  const ev = totalExpectedPayout - config.ticketPriceUsd;
  const evReturnRate = (totalExpectedPayout / config.ticketPriceUsd) * 100;

  return {
    ev: Number(ev.toFixed(2)),
    evReturnRate: Number(evReturnRate.toFixed(1))
  };
}

// Comparison realities for perspective
export interface RealityComparison {
  name: string;
  oneIn: number;
  timesEasierThanJackpot: number;
  description: string;
}

export function getRealityComparisons(jackpotOdds: number): RealityComparison[] {
  const events = [
    { name: 'Bị sét đánh trúng trong năm', oneIn: 1_220_000, description: 'Theo thống kê của Cơ quan Thời tiết Quốc gia Mỹ (NWS)' },
    { name: 'Bị sét đánh trúng một lần trong cả đời (80 năm)', oneIn: 15_300, description: 'Rất dễ xảy ra hơn so với trúng độc đắc' },
    { name: 'Bị cá mập tấn công khi đi biển', oneIn: 3_750_000, description: 'Theo dữ liệu từ ISAF (Hồ sơ tấn công cá mập quốc tế)' },
    { name: 'Sinh 4 tự nhiên (Quadruplets)', oneIn: 729_000, description: 'Xác suất sinh 4 bé cùng một lần mang thai tự nhiên' },
    { name: 'Trở thành phi hành gia của NASA', oneIn: 12_000_000, description: 'Dựa trên số lượng ứng viên được tuyển chọn hàng năm' },
    { name: 'Tung đồng xu 28 lần liên tiếp toàn mặt ngửa', oneIn: 268_435_456, description: 'Gần tương đương với xác suất trúng Jackpot Powerball!' }
  ];

  return events.map(e => ({
    ...e,
    timesEasierThanJackpot: Math.round(jackpotOdds / e.oneIn)
  }));
}
