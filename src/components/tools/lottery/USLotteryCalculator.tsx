import React, { useState, useMemo, useCallback } from 'react';
import {
  Ticket,
  DollarSign,
  Trophy,
  Percent,
  Sparkles,
  RotateCcw,
  Layers,
  TrendingUp,
  AlertCircle,
  Play,
  Shuffle,
  Info,
  Zap
} from 'lucide-react';
import { 
  US_LOTTERY_GAMES, 
  generateBaoOptions, 
  getTotalCombinations, 
  getOverallWinningOdds, 
  calcChanceAtLeastOne, 
  calculateExpectedValue, 
  getRealityComparisons, 
  formatOdds,
  combinations 
} from './lotteryMath';
import { LotteryGameId, SimulationResult } from './types';

export const USLotteryCalculator: React.FC = () => {
  // Current game selection
  const [gameId, setGameId] = useState<LotteryGameId>('powerball');

  // Input Mode: 'tickets' (enter money or quantity) vs 'bao' (system bet / wheeling)
  const [inputMode, setInputMode] = useState<'tickets' | 'bao'>('tickets');

  // Mode 1: Tickets / Budget inputs
  const [ticketCount, setTicketCount] = useState<number>(10);
  const [budgetUsd, setBudgetUsd] = useState<number>(20);

  // Mode 2: "Bao số" inputs
  const [selectedBaoLevel, setSelectedBaoLevel] = useState<number>(7); // Bao 7 (choose 7 white balls)
  const [baoSpecialMode, setBaoSpecialMode] = useState<'single' | 'all'>('single'); // 1 PB vs Bao all PB
  const [baoSetsCount, setBaoSetsCount] = useState<number>(1); // Number of bao sets bought
  const [customBaoBudget, setCustomBaoBudget] = useState<string>(''); // User can enter budget to buy bao

  // Custom Jackpot Prize for EV calculation
  const [customJackpot, setCustomJackpot] = useState<number>(250_000_000); // 250M USD default
  const [includeTax, setIncludeTax] = useState<boolean>(true); // 37% Federal tax

  // Custom game inputs (if gameId === 'custom')
  const customWhiteTotal = 69;
  const customWhitePick = 5;
  const customSpecialTotal = 26;
  const customTicketPrice = 2;

  // Simulation state
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Active game config
  const currentGame = useMemo(() => {
    if (gameId === 'custom') {
      const customConfig = { ...US_LOTTERY_GAMES.custom };
      customConfig.whiteBallsTotal = Math.max(10, customWhiteTotal);
      customConfig.whiteBallsPick = Math.max(3, Math.min(10, customWhitePick));
      customConfig.specialBallsTotal = Math.max(1, customSpecialTotal);
      customConfig.ticketPriceUsd = Math.max(0.5, customTicketPrice);
      customConfig.defaultJackpotUsd = customJackpot;
      return customConfig;
    }
    return US_LOTTERY_GAMES[gameId];
  }, [gameId, customWhiteTotal, customWhitePick, customSpecialTotal, customTicketPrice, customJackpot]);

  const ticketPrice = currentGame.ticketPriceUsd;

  // Handle Budget input change -> auto update tickets
  const handleBudgetChange = (usdVal: number) => {
    const valid = Math.max(0, usdVal);
    setBudgetUsd(valid);
    setTicketCount(Math.floor(valid / ticketPrice));
  };

  // Handle Ticket count change -> auto update budget
  const handleTicketCountChange = (countVal: number) => {
    const valid = Math.max(1, Math.floor(countVal));
    setTicketCount(valid);
    setBudgetUsd(valid * ticketPrice);
  };

  // Bao options for current ticket price
  const baoOptions = useMemo(() => {
    return generateBaoOptions(ticketPrice);
  }, [ticketPrice]);

  // Current Bao calculation
  const currentBao = useMemo(() => {
    const whiteCombos = combinations(selectedBaoLevel, currentGame.whiteBallsPick);
    const specialMultiplier = baoSpecialMode === 'all' ? currentGame.specialBallsTotal : 1;
    const totalTicketsInOneBao = whiteCombos * specialMultiplier;
    const costPerBaoSet = totalTicketsInOneBao * ticketPrice;
    const totalBaoTickets = totalTicketsInOneBao * baoSetsCount;
    const totalBaoCostUsd = costPerBaoSet * baoSetsCount;

    return {
      whiteCombos,
      specialMultiplier,
      totalTicketsInOneBao,
      costPerBaoSet,
      totalBaoTickets,
      totalBaoCostUsd
    };
  }, [selectedBaoLevel, currentGame.whiteBallsPick, currentGame.specialBallsTotal, baoSpecialMode, baoSetsCount, ticketPrice]);

  // Effective tickets and cost depending on active mode
  const { effectiveTickets, totalSpentUsd } = useMemo(() => {
    if (inputMode === 'tickets') {
      return {
        effectiveTickets: Math.max(1, ticketCount),
        totalSpentUsd: Math.max(1, ticketCount) * ticketPrice
      };
    } else {
      return {
        effectiveTickets: currentBao.totalBaoTickets,
        totalSpentUsd: currentBao.totalBaoCostUsd
      };
    }
  }, [inputMode, ticketCount, ticketPrice, currentBao]);

  // Total combinations for current game
  const totalCombinations = useMemo(() => {
    return getTotalCombinations(currentGame);
  }, [currentGame]);

  // Probability calculations
  const oddsData = useMemo(() => {
    // 1 ticket Jackpot probability
    const singleJackpotOdds = totalCombinations;
    // N tickets Jackpot probability = 1 - (1 - 1/totalCombinations)^N
    const jackpotProb = calcChanceAtLeastOne(singleJackpotOdds, effectiveTickets);
    const jackpotOneIn = jackpotProb > 0 ? Math.round(1 / jackpotProb) : singleJackpotOdds;

    // Any prize probability (standard is ~ 1 in 24.87 for Powerball)
    const overallOddsSingle = getOverallWinningOdds(currentGame);
    const anyPrizeProb = calcChanceAtLeastOne(overallOddsSingle, effectiveTickets);
    const anyPrizeOneIn = anyPrizeProb > 0 ? Math.max(1, Math.round(1 / anyPrizeProb)) : overallOddsSingle;

    // Expected Value per ticket
    const evData = calculateExpectedValue(currentGame, customJackpot, includeTax);

    // Number of tickets needed for 50% chance of Jackpot: n = ln(0.5) / ln(1 - 1/N) ≈ 0.693 * N
    const ticketsFor50Percent = Math.round(Math.LN2 * totalCombinations);
    const costFor50Percent = ticketsFor50Percent * ticketPrice;

    // 100% buy all combinations
    const costBuyAllUsd = totalCombinations * ticketPrice;

    return {
      singleJackpotOdds,
      jackpotProb,
      jackpotOneIn,
      overallOddsSingle,
      anyPrizeProb,
      anyPrizeOneIn,
      evData,
      ticketsFor50Percent,
      costFor50Percent,
      costBuyAllUsd
    };
  }, [totalCombinations, effectiveTickets, currentGame, customJackpot, includeTax, ticketPrice]);

  // Reality comparisons
  const comparisons = useMemo(() => {
    return getRealityComparisons(oddsData.jackpotOneIn);
  }, [oddsData.jackpotOneIn]);

  // Format currency in USD ($)
  const formatMoney = useCallback((usd: number): string => {
    if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)} tỷ USD`;
    if (usd >= 1e6) return `$${(usd / 1e6).toFixed(2)} triệu USD`;
    return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }, []);

  // Run interactive simulation
  const handleSimulateDraw = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // Pick random winning numbers
      const whitePool = Array.from({ length: currentGame.whiteBallsTotal }, (_, i) => i + 1);
      const shuffledWhite = [...whitePool].sort(() => Math.random() - 0.5);
      const winningWhite = shuffledWhite.slice(0, currentGame.whiteBallsPick).sort((a, b) => a - b);
      const winningSpecial = Math.floor(Math.random() * currentGame.specialBallsTotal) + 1;

      // Simulate tickets (using probabilistic distribution based on exact odds)
      const tierCounts: Record<string, number> = {};
      let totalWon = 0;
      let jackpotWon = false;

      // For each tier, compute hits
      for (const tier of currentGame.tiers) {
        tierCounts[tier.name] = 0;
        const prob = tier.winningCombinations / totalCombinations;
        
        // Use Poisson or Binomial approximation for N tickets
        let hits = 0;
        const expectedHits = effectiveTickets * prob;
        
        if (expectedHits < 0.05) {
          // Bernoulli trial for rare events
          hits = Math.random() < (1 - Math.exp(-effectiveTickets * prob)) ? 1 : 0;
        } else {
          // Gaussian approximation
          const stdDev = Math.sqrt(effectiveTickets * prob * (1 - prob));
          // Box-Muller transform
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2.0 * Math.log(u1 || 1e-10)) * Math.cos(2.0 * Math.PI * u2);
          hits = Math.max(0, Math.round(expectedHits + z * stdDev));
        }

        tierCounts[tier.name] = hits;
        if (hits > 0) {
          let prize = tier.prizeUsd;
          if (tier.isJackpot) {
            prize = customJackpot;
            jackpotWon = true;
          }
          totalWon += hits * prize;
        }
      }

      const totalSpent = effectiveTickets * ticketPrice;
      const netProfit = totalWon - totalSpent;

      setSimResult({
        drawWhite: winningWhite,
        drawSpecial: winningSpecial,
        totalTickets: effectiveTickets,
        totalSpent,
        totalWon,
        netProfit,
        tierCounts,
        jackpotWon
      });

      setIsSimulating(false);
    }, 250);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-blue-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-amber-200 dark:border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xs dark:shadow-none">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-rose-500/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-300 dark:border-amber-500/40 shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Máy Tính Xác Suất Xổ Số Mỹ & Đánh Bao Số
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                Powerball • Mega Millions
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Phân tích cơ hội trúng Jackpot, bảng 9 hạng giải, tính giá trị kỳ vọng (EV) và chi phí đánh Bao Số (System Bet)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono shadow-2xs">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Đơn vị tiền tệ: <strong className="text-slate-900 dark:text-white">USD ($)</strong></span>
        </div>
      </div>

      {/* Lottery Game Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(Object.keys(US_LOTTERY_GAMES) as LotteryGameId[]).map((id) => {
          const g = US_LOTTERY_GAMES[id];
          const isSelected = gameId === id;
          return (
            <button
              key={id}
              onClick={() => {
                setGameId(id);
                if (g.defaultJackpotUsd) setCustomJackpot(g.defaultJackpotUsd);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Ticket className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Control Panel (Left) & Key Statistics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs & Settings (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mode Switcher: Standard Tickets vs System Bet (Bao số) */}
          <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Phương thức chọn vé:
              </span>
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setInputMode('tickets')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    inputMode === 'tickets' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Vé Thường / Tiền
                </button>
                <button
                  onClick={() => setInputMode('bao')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    inputMode === 'bao' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Đánh Bao Số
                </button>
              </div>
            </div>

            {/* Mode 1: Standard Tickets & Budget */}
            {inputMode === 'tickets' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Số tiền bạn bỏ ra ($ USD):
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Giá: ${ticketPrice}/vé
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="lottery-budget-input"
                      type="number"
                      min={ticketPrice}
                      step={ticketPrice}
                      value={budgetUsd}
                      onChange={(e) => handleBudgetChange(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden text-sm"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      $
                    </div>
                  </div>
                </div>

                {/* Quick Budget Chips */}
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">Ngân sách nhanh:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 20, 50, 100, 500, 1000, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleBudgetChange(val)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          budgetUsd === val
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tickets Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Số lượng vé tương ứng:
                    </label>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {ticketCount.toLocaleString()} vé
                    </span>
                  </div>
                  <input
                    id="lottery-tickets-input"
                    type="number"
                    min="1"
                    value={ticketCount}
                    onChange={(e) => handleTicketCountChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden text-sm"
                  />
                </div>
              </div>
            )}

            {/* Mode 2: System Bet ("Bao Số" Wheeling) */}
            {inputMode === 'bao' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-600/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Đánh Bao Số (System Bet / Wheeling) là gì?
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    Bạn chọn từ 6 đến 20 số trắng. Hệ thống tự động tạo tất cả các tổ hợp 5 số tương ứng C(M, 5). Nếu các số bạn chọn trùng với kết quả, bạn sẽ trúng cùng lúc nhiều hạng giải!
                  </p>
                </div>

                {/* Select Bao Level */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Chọn loại Bao số trắng (Cấp độ bao):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {baoOptions.map((opt) => (
                      <button
                        key={opt.level}
                        onClick={() => setSelectedBaoLevel(opt.level)}
                        className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                          selectedBaoLevel === opt.level
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-1 ring-amber-400'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{opt.label}</div>
                        <div className="text-[10px] opacity-80">{opt.combinations} tổ hợp</div>
                        <div className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                          ${opt.costUsd.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bao bóng đặc biệt (Powerball / Mega Ball) */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    Tùy chọn bóng đặc biệt ({currentGame.specialBallName}):
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setBaoSpecialMode('single')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        baoSpecialMode === 'single'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div>Chọn 1 bóng đỏ</div>
                      <div className="text-[10px] opacity-80">1 bóng ({currentGame.specialBallName})</div>
                    </button>
                    <button
                      onClick={() => setBaoSpecialMode('all')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        baoSpecialMode === 'all'
                          ? 'bg-rose-600 text-white border-rose-600 font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div>Bao toàn bộ {currentGame.specialBallsTotal} bóng</div>
                      <div className="text-[10px] font-semibold text-rose-700 dark:text-amber-200">100% trúng bóng đỏ!</div>
                    </button>
                  </div>
                </div>

                {/* Number of Bao Sets or Custom Budget for Bao */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Số bộ Bao mua:
                    </label>
                    <input
                      id="bao-sets-count"
                      type="number"
                      min="1"
                      value={baoSetsCount}
                      onChange={(e) => setBaoSetsCount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-sm outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Chi phí trọn gói Bao:
                    </label>
                    <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-amber-700 dark:text-amber-400 font-mono font-bold text-sm truncate">
                      {formatMoney(currentBao.totalBaoCostUsd)}
                    </div>
                  </div>
                </div>

                {/* Interactive: Nhập số tiền mua bao để tìm gói tối ưu */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Hoặc nhập số tiền dự tính mua bao:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="vd: 500 hoặc 1000 ($)"
                      value={customBaoBudget}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomBaoBudget(val);
                        const num = Number(val);
                        if (num > 0) {
                          // Find highest bao that fits
                          const fittingBao = [...baoOptions].reverse().find(b => b.costUsd <= num);
                          if (fittingBao) {
                            setSelectedBaoLevel(fittingBao.level);
                            const sets = Math.floor(num / fittingBao.costUsd);
                            setBaoSetsCount(Math.max(1, sets));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                    <button
                      onClick={() => {
                        setCustomBaoBudget('500');
                        setSelectedBaoLevel(9); // Bao 9 = $252
                        setBaoSetsCount(1);
                      }}
                      className="px-2.5 py-2 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                    >
                      Thử $500
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Jackpot & Tax Settings */}
          <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs dark:shadow-xl">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Giá Trị Giải Jackpot Hiện Tại & Thuế:
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-slate-600 dark:text-slate-400">Jackpot đang tích lũy ($ USD):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {formatMoney(customJackpot)}
                </span>
              </div>
              <input
                id="lottery-custom-jackpot"
                type="number"
                step="10000000"
                min="20000000"
                value={customJackpot}
                onChange={(e) => setCustomJackpot(Math.max(10_000_000, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {[100_000_000, 250_000_000, 500_000_000, 1_000_000_000, 1_600_000_000].map((jp) => (
                  <button
                    key={jp}
                    onClick={() => setCustomJackpot(jp)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer border ${
                      customJackpot === jp
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ${jp >= 1e9 ? `${jp / 1e9}B` : `${jp / 1e6}M`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Khấu trừ thuế liên bang Mỹ (37%) khi tính EV</span>
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {includeTax ? 'Thuế 37%' : 'Chưa trừ thuế'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Probability Stats & Highlights (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main 4 Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Metric 1: Jackpot Odds */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-blue-950/70 dark:via-slate-900 dark:to-indigo-950/70 border border-slate-200 dark:border-blue-500/40 shadow-xs dark:shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 mb-1.5">
                <span className="font-semibold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  Xác Suất Trúng Jackpot
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-300 font-mono">
                  {effectiveTickets.toLocaleString()} vé
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                {formatOdds(oddsData.jackpotOneIn)}
              </div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                {(oddsData.jackpotProb * 100).toFixed(7)}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 leading-tight">
                Tỷ lệ gốc: {formatOdds(oddsData.singleJackpotOdds)} (cho 1 vé duy nhất)
              </p>
            </div>

            {/* Metric 2: Any Prize Odds */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-emerald-950/70 dark:via-slate-900 dark:to-teal-950/70 border border-slate-200 dark:border-emerald-500/40 shadow-xs dark:shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 mb-1.5">
                <span className="font-semibold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Xác Suất Trúng Ít Nhất 1 Giải
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-mono">
                  Mọi giải
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 tracking-tight font-sans">
                {(oddsData.anyPrizeProb * 100).toFixed(2)}%
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium mt-1">
                Tương đương {formatOdds(oddsData.anyPrizeOneIn)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 leading-tight">
                Cơ hội nhận lại bất kỳ giải thưởng nào (từ giải $4 đến Jackpot)
              </p>
            </div>

            {/* Metric 3: Total Money & Tickets */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-amber-950/60 dark:via-slate-900 dark:to-orange-950/60 border border-slate-200 dark:border-amber-500/40 shadow-xs dark:shadow-xl">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 mb-1.5">
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Tổng Tiền Đầu Tư
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-300 font-mono">
                  {effectiveTickets.toLocaleString()} bộ số
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-300 tracking-tight font-mono">
                {formatMoney(totalSpentUsd)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Đơn giá: ${ticketPrice} / vé ({effectiveTickets.toLocaleString()} vé)
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 leading-tight">
                {inputMode === 'bao' 
                  ? `${baoSetsCount} bộ Bao ${selectedBaoLevel} (${currentBao.whiteCombos} tổ hợp x ${currentBao.specialMultiplier} bóng đỏ)`
                  : `Mua ${effectiveTickets.toLocaleString()} vé đơn ngẫu nhiên`}
              </p>
            </div>

            {/* Metric 4: Expected Value (EV) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-purple-950/60 dark:via-slate-900 dark:to-pink-950/60 border border-slate-200 dark:border-purple-500/40 shadow-xs dark:shadow-xl">
              <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 mb-1.5">
                <span className="font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Giá Trị Kỳ Vọng (EV / Vé)
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${oddsData.evData.ev >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'}`}>
                  {oddsData.evData.ev >= 0 ? 'EV Dương' : 'EV Âm'}
                </span>
              </div>
              <div className={`text-xl sm:text-2xl font-extrabold tracking-tight font-mono ${oddsData.evData.ev >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {oddsData.evData.ev >= 0 ? `+${oddsData.evData.ev}$` : `${oddsData.evData.ev}$`}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Tỷ lệ hoàn lại: <span className="font-bold text-slate-900 dark:text-white">{oddsData.evData.evReturnRate}%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 leading-tight">
                Với mỗi ${ticketPrice} bỏ ra, trung bình toán học bạn thu về ${(ticketPrice + oddsData.evData.ev).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Educational Insights / "Bao Nhiêu Vé Để Chắc Trúng?" */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs dark:shadow-xl">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Góc nhìn toán học: Cần bao nhiêu vé để có cơ hội trúng Jackpot?</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Đạt 1% cơ hội trúng:</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono block mt-0.5">
                  {(Math.round(totalCombinations * 0.01)).toLocaleString()} vé
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Chi phí: {formatMoney(Math.round(totalCombinations * 0.01) * ticketPrice)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Đạt 50% cơ hội trúng:</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono block mt-0.5">
                  {oddsData.ticketsFor50Percent.toLocaleString()} vé
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Chi phí: {formatMoney(oddsData.costFor50Percent)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Bao trọn 100% tất cả tổ hợp:</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono block mt-0.5">
                  {totalCombinations.toLocaleString()} vé
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Chi phí: {formatMoney(oddsData.costBuyAllUsd)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              * Lưu ý: Mua hết 292.2 triệu tổ hợp để 100% trúng độc đắc không khả thi vì nếu có người khác cùng trúng, giải sẽ bị chia đôi, cùng với thuế 37% sẽ dẫn đến thua lỗ nặng!
            </p>
          </div>

          {/* Interactive Draw Simulator */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-slate-200 dark:border-blue-500/30 space-y-4 shadow-xs dark:shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Mô Phỏng Quay Thử Kết Quả Kỳ Này
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Thử vận may với {effectiveTickets.toLocaleString()} vé ({formatMoney(totalSpentUsd)}) vừa chọn
                </p>
              </div>
              <button
                onClick={handleSimulateDraw}
                disabled={isSimulating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang quay số...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Bấm Quay Thử Ngay</span>
                  </>
                )}
              </button>
            </div>

            {simResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Bóng số quay được:</span>
                  <div className="flex items-center gap-1.5">
                    {simResult.drawWhite.map((num, i) => (
                      <span key={i} className="w-7 h-7 rounded-full bg-white text-slate-900 font-bold font-mono text-xs flex items-center justify-center shadow-xs border border-slate-200 dark:border-transparent">
                        {num}
                      </span>
                    ))}
                    <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold font-mono text-xs flex items-center justify-center shadow-xs ring-2 ring-rose-300 dark:ring-rose-400">
                      {simResult.drawSpecial}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tiền vé đã chi:</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{formatMoney(simResult.totalSpent)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tổng tiền trúng:</span>
                    <span className={`font-mono font-bold ${simResult.totalWon > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {formatMoney(simResult.totalWon)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Lãi / Lỗ ròng:</span>
                    <span className={`font-mono font-bold ${simResult.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {simResult.netProfit >= 0 ? `+${formatMoney(simResult.netProfit)}` : `-${formatMoney(Math.abs(simResult.netProfit))}`}
                    </span>
                  </div>
                </div>

                {/* Awards won list */}
                <div className="text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Các giải trúng được trong kỳ:</span>
                  <div className="space-y-1">
                    {Object.entries(simResult.tierCounts).filter(([_, count]) => count > 0).length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 italic">Không trúng giải nào trong kỳ quay này. Hãy thử lại!</p>
                    ) : (
                      Object.entries(simResult.tierCounts)
                        .filter(([_, count]) => count > 0)
                        .map(([name, count]) => (
                          <div key={name} className="flex items-center justify-between py-1 px-2.5 rounded bg-emerald-50 dark:bg-slate-900/60 text-emerald-800 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-transparent">
                            <span>{name}</span>
                            <span className="font-bold">Trúng {count.toLocaleString()} giải</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prize Breakdown Table (All 9 Tiers) */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span>Bảng Chi Tiết Tất Cả Các Hạng Giải Thưởng ({currentGame.name})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Xác suất và cơ hội trúng cho từng hạng giải với số lượng {effectiveTickets.toLocaleString()} vé hiện tại
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            Tổng tổ hợp: {totalCombinations.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Hạng Giải</th>
                <th className="p-3 text-center">Trùng Khớp</th>
                <th className="p-3 text-right">Tiền Thưởng</th>
                <th className="p-3 text-center">Tỷ Lệ Gốc (1 Vé)</th>
                <th className="p-3 text-center">Tỷ Lệ Với {effectiveTickets.toLocaleString()} Vé</th>
                <th className="p-3 text-right">Xác Suất (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-sans">
              {currentGame.tiers.map((tier, idx) => {
                const singleOdds = totalCombinations / tier.winningCombinations;
                const tierProb = calcChanceAtLeastOne(singleOdds, effectiveTickets);
                const tierOddsCurrent = tierProb > 0 ? Math.round(1 / tierProb) : singleOdds;

                return (
                  <tr 
                    key={idx} 
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      tier.isJackpot ? 'bg-amber-50/70 dark:bg-amber-500/10 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      {tier.isJackpot ? (
                        <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 inline-block animate-pulse" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
                      )}
                      <span>{tier.name}</span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-300">
                      {tier.matchWhite} số trắng {tier.matchSpecial ? `+ ${currentGame.specialBallName}` : ''}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-amber-700 dark:text-amber-300">
                      {tier.isJackpot ? formatMoney(customJackpot) : formatMoney(tier.prizeUsd)}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {formatOdds(singleOdds)}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-blue-700 dark:text-blue-300">
                      {formatOdds(tierOddsCurrent)}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {(tierProb * 100).toFixed(tier.isJackpot ? 7 : 4)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fun Reality Check: So Sánh Xác Suất Với Đời Thực */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              So Sánh Xác Suất Trúng Độc Đắc Với Hiện Tượng Đời Thực (Reality Check)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hiểu rõ tính chất ngẫu nhiên cực đại của xổ số qua lăng kính toán học
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparisons.map((c, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-200">{c.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-mono">
                  {formatOdds(c.oneIn)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{c.description}</p>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-700/60">
                Dễ xảy ra hơn trúng Jackpot <span className="font-bold font-mono">{c.timesEasierThanJackpot.toLocaleString()}</span> lần!
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
