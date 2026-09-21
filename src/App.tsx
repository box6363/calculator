import { useState, useEffect } from 'react';
import { ToolId } from './types';
import { TOOLS_CONFIG } from './data/toolsData';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomTabBar } from './components/common/BottomTabBar';
import { ToolLayout } from './components/common/ToolLayout';
import { GeminiDrawer } from './components/common/GeminiDrawer';
import { TermsModal } from './components/common/TermsModal';
import { LanguageSelector } from './components/common/LanguageSelector';
import { GlobalFooterEcosystem } from './components/common/GlobalFooterEcosystem';
import { useLanguage } from './context/LanguageContext';
import { ShieldCheck, Copyright, FileText, Lock, Globe } from 'lucide-react';

// Direct synchronous imports for instant (0ms) zero-latency tab switching without loading delays
import { BasicCalculator } from './components/tools/BasicCalculator';
import { AiTool } from './components/tools/AiTool';
import { BmiCalculator } from './components/tools/BmiCalculator';
import { LoanCalculator } from './components/tools/LoanCalculator';
import { SalaryCalculator } from './components/tools/SalaryCalculator';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { PercentageCalculator } from './components/tools/PercentageCalculator';
import { UnitConverter } from './components/tools/UnitConverter';
import { TrigonometryCalculator } from './components/tools/TrigonometryCalculator';
import { CompoundInterestCalculator } from './components/tools/CompoundInterestCalculator';
import { MortgageCalculator } from './components/tools/MortgageCalculator';
import { CalorieCalculator } from './components/tools/CalorieCalculator';
import { BodyFatCalculator } from './components/tools/BodyFatCalculator';
import { TimeCalculator } from './components/tools/TimeCalculator';
import { DateCalculator } from './components/tools/DateCalculator';
import { TipCalculator } from './components/tools/TipCalculator';
import { DiscountCalculator } from './components/tools/DiscountCalculator';
import { TaxCalculator } from './components/tools/TaxCalculator';
import { PaceCalculator } from './components/tools/PaceCalculator';
import { OvulationCalculator } from './components/tools/OvulationCalculator';
import { GpaCalculator } from './components/tools/GpaCalculator';
import { ConcreteCalculator } from './components/tools/ConcreteCalculator';
import { RandomNumberCalculator } from './components/tools/RandomNumberCalculator';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { AutoLoanCalculator } from './components/tools/AutoLoanCalculator';
import { InterestCalculator } from './components/tools/InterestCalculator';
import { PaymentCalculator } from './components/tools/PaymentCalculator';
import { RetirementCalculator } from './components/tools/RetirementCalculator';
import { AmortizationCalculator } from './components/tools/AmortizationCalculator';
import { InvestmentCalculator } from './components/tools/InvestmentCalculator';
import { InflationCalculator } from './components/tools/InflationCalculator';
import { FinanceCalculator } from './components/tools/FinanceCalculator';
import { BmrCalculator } from './components/tools/BmrCalculator';
import { IdealWeightCalculator } from './components/tools/IdealWeightCalculator';
import { PregnancyCalculator } from './components/tools/PregnancyCalculator';
import { ArmyBodyFatCalculator } from './components/tools/ArmyBodyFatCalculator';
import { HealthyWeightCalculator } from './components/tools/HealthyWeightCalculator';
import { FractionCalculator } from './components/tools/FractionCalculator';
import { TriangleCalculator } from './components/tools/TriangleCalculator';
import { StandardDeviationCalculator } from './components/tools/StandardDeviationCalculator';
import { AverageCalculator } from './components/tools/AverageCalculator';
import { MeanMedianModeCalculator } from './components/tools/MeanMedianModeCalculator';
import { RootCalculator } from './components/tools/RootCalculator';
import { ExponentCalculator } from './components/tools/ExponentCalculator';
import { LogCalculator } from './components/tools/LogCalculator';
import { QuadraticCalculator } from './components/tools/QuadraticCalculator';
import { GraphingCalculator } from './components/tools/GraphingCalculator';
import { SlopeCalculator } from './components/tools/SlopeCalculator';
import { AreaCalculator } from './components/tools/AreaCalculator';
import { VolumeCalculator } from './components/tools/VolumeCalculator';
import { PerimeterCalculator } from './components/tools/PerimeterCalculator';
import { CircleCalculator } from './components/tools/CircleCalculator';
import { RightTriangleCalculator } from './components/tools/RightTriangleCalculator';
import { StatisticsCalculator } from './components/tools/StatisticsCalculator';
import { ProbabilityCalculator } from './components/tools/ProbabilityCalculator';
import { LengthConverter } from './components/tools/LengthConverter';
import { WeightConverter } from './components/tools/WeightConverter';
import { TemperatureConverter } from './components/tools/TemperatureConverter';
import { CurrencyConverter } from './components/tools/CurrencyConverter';
import { IpSubnetCalculator } from './components/tools/IpSubnetCalculator';
import { USLotteryCalculator } from './components/tools/lottery/USLotteryCalculator';

// Helper to parse tool ID from clean path or hash
const parseToolFromUrl = (): ToolId => {
  if (typeof window === 'undefined') return 'basic';

  const parts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  
  // 1. Check path with language prefix (e.g. /en/bmi, /vi/salary, /ja/loan)
  if (parts.length >= 2) {
    const candidate = parts[1].toLowerCase();
    if (TOOLS_CONFIG[candidate as ToolId]) {
      return candidate as ToolId;
    }
  }

  // 2. Check path without language prefix (e.g. /bmi, /salary, /loan)
  if (parts.length === 1) {
    const candidate = parts[0].toLowerCase();
    if (TOOLS_CONFIG[candidate as ToolId]) {
      return candidate as ToolId;
    }
  }

  // 3. Fallback to hash (e.g. #salary, #bmi)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase() as ToolId;
  if (hash && TOOLS_CONFIG[hash]) {
    return hash;
  }

  return 'basic';
};

export default function App() {
  const { language, t } = useLanguage();

  // Initialize tool from clean path or URL hash
  const [currentToolId, setCurrentToolId] = useState<ToolId>(() => parseToolFromUrl());

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState<boolean>(false);
  const [geminiToolKey, setGeminiToolKey] = useState<ToolId>('basic');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  const handleOpenGeminiDrawer = (toolKey?: ToolId) => {
    if (toolKey) {
      setGeminiToolKey(toolKey);
    } else {
      setGeminiToolKey(currentToolId);
    }
    setIsGeminiDrawerOpen(true);
  };

  // Sync tool change with clean path URL: /${language}/${toolId}
  const handleSelectTool = (id: ToolId) => {
    setCurrentToolId(id);
    const cleanPath = id === 'basic' ? `/${language}/` : `/${language}/${id}`;
    const search = window.location.search || '';
    const fullUrl = `${cleanPath}${search}`;
    if (window.location.pathname !== cleanPath) {
      window.history.pushState({ lang: language, toolId: id }, '', fullUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (browser back/forward) and hashchange
  useEffect(() => {
    const onLocationChange = () => {
      const toolId = parseToolFromUrl();
      if (toolId !== currentToolId) {
        setCurrentToolId(toolId);
      }
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, [currentToolId]);

  const handleResetTool = () => {
    setResetKey(prev => prev + 1);
  };

  const currentTool = TOOLS_CONFIG[currentToolId] || TOOLS_CONFIG.basic;

  const renderToolComponent = () => {
    switch (currentToolId) {
      case 'basic':
        return <BasicCalculator initialMode="standard" key={resetKey} />;
      case 'ai':
        return <AiTool key={resetKey} />;
      case 'bmi':
        return <BmiCalculator key={resetKey} />;
      case 'loan':
        return <LoanCalculator key={resetKey} />;
      case 'salary':
        return <SalaryCalculator key={resetKey} />;
      case 'age':
        return <AgeCalculator key={resetKey} />;
      case 'percentage':
        return <PercentageCalculator key={resetKey} />;
      case 'unit':
        return <UnitConverter key={resetKey} />;
      case 'trigonometry':
        return <TrigonometryCalculator key={resetKey} />;
      case 'compound':
        return <CompoundInterestCalculator key={resetKey} />;
      case 'mortgage':
        return <MortgageCalculator key={resetKey} />;
      case 'calorie':
        return <CalorieCalculator key={resetKey} />;
      case 'bodyfat':
        return <BodyFatCalculator key={resetKey} />;
      case 'time':
        return <TimeCalculator key={resetKey} />;
      case 'date':
        return <DateCalculator key={resetKey} />;
      case 'tip':
        return <TipCalculator key={resetKey} />;
      case 'discount':
        return <DiscountCalculator key={resetKey} />;
      case 'tax':
        return <TaxCalculator key={resetKey} />;
      case 'pace':
        return <PaceCalculator key={resetKey} />;
      case 'ovulation':
        return <OvulationCalculator key={resetKey} />;
      case 'gpa':
        return <GpaCalculator key={resetKey} />;
      case 'concrete':
        return <ConcreteCalculator key={resetKey} />;
      case 'random':
        return <RandomNumberCalculator key={resetKey} />;
      case 'password':
        return <PasswordGenerator key={resetKey} />;
      case 'autoloan':
        return <AutoLoanCalculator key={resetKey} />;
      case 'interest':
        return <InterestCalculator key={resetKey} />;
      case 'payment':
        return <PaymentCalculator key={resetKey} />;
      case 'retirement':
        return <RetirementCalculator key={resetKey} />;
      case 'amortization':
        return <AmortizationCalculator key={resetKey} />;
      case 'investment':
        return <InvestmentCalculator key={resetKey} />;
      case 'inflation':
        return <InflationCalculator key={resetKey} />;
      case 'finance':
        return <FinanceCalculator key={resetKey} />;
      case 'bmr':
        return <BmrCalculator key={resetKey} />;
      case 'idealweight':
        return <IdealWeightCalculator key={resetKey} />;
      case 'pregnancy':
        return <PregnancyCalculator key={resetKey} />;
      case 'armybodyfat':
        return <ArmyBodyFatCalculator key={resetKey} />;
      case 'healthyweight':
        return <HealthyWeightCalculator key={resetKey} />;
      case 'lottery':
        return <USLotteryCalculator key={resetKey} />;
      case 'fraction':
        return <FractionCalculator key={resetKey} />;
      case 'triangle':
        return <TriangleCalculator key={resetKey} />;
      case 'standarddeviation':
        return <StandardDeviationCalculator key={resetKey} />;
      case 'average':
        return <AverageCalculator key={resetKey} />;
      case 'meanmedianmode':
        return <MeanMedianModeCalculator key={resetKey} />;
      case 'root':
        return <RootCalculator key={resetKey} />;
      case 'exponent':
        return <ExponentCalculator key={resetKey} />;
      case 'log':
        return <LogCalculator key={resetKey} />;
      case 'quadratic':
        return <QuadraticCalculator key={resetKey} />;
      case 'graphing':
        return <GraphingCalculator key={resetKey} />;
      case 'slope':
        return <SlopeCalculator key={resetKey} />;
      case 'area':
        return <AreaCalculator key={resetKey} />;
      case 'volume':
        return <VolumeCalculator key={resetKey} />;
      case 'perimeter':
        return <PerimeterCalculator key={resetKey} />;
      case 'circle':
        return <CircleCalculator key={resetKey} />;
      case 'righttriangle':
        return <RightTriangleCalculator key={resetKey} />;
      case 'statistics':
        return <StatisticsCalculator key={resetKey} />;
      case 'probability':
        return <ProbabilityCalculator key={resetKey} />;
      case 'length':
        return <LengthConverter key={resetKey} />;
      case 'weight':
        return <WeightConverter key={resetKey} />;
      case 'temperature':
        return <TemperatureConverter key={resetKey} />;
      case 'currency':
        return <CurrencyConverter key={resetKey} />;
      case 'ipsubnet':
        return <IpSubnetCalculator key={resetKey} />;
      default:
        return <BasicCalculator key={resetKey} />;
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg, #141526)',
        color: 'var(--app-text-primary, #ffffff)'
      }}
    >
      
      {/* Top Main Header */}
      <Header
        currentToolId={currentToolId}
        onSelectTool={handleSelectTool}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Center Layout: Desktop Collapsible Sidebar + Full-width Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentToolId={currentToolId}
          onSelectTool={handleSelectTool}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6 pb-24 sm:pb-8">
          <ToolLayout
            tool={currentTool}
            onSelectTool={handleSelectTool}
            onResetTool={handleResetTool}
            onOpenGemini={handleOpenGeminiDrawer}
          >
            {renderToolComponent()}
          </ToolLayout>

          {/* Comprehensive 5-Column Ecosystem & Utility Footer Network (matching screenshot) */}
          <GlobalFooterEcosystem
            onSelectTool={handleSelectTool}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenGemini={() => handleOpenGeminiDrawer()}
          />

          {/* Footer with AC Studio Copyright & 16-Language Support */}
          <footer className="w-full max-w-5xl mx-auto mt-12 pt-8 pb-16 border-t border-slate-800/80 text-xs text-slate-400 space-y-4">
            {/* Top row: Badges & Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                {t.speedMetric}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                {t.freePledge}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {t.localProcessingPledge}
              </span>
            </div>

            {/* Middle row: Links & Language Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.termsTitle}</span>
              </button>

              <button
                onClick={() => setIsTermsOpen(true)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.privacyTitle}</span>
              </button>

              <button
                onClick={() => setIsTermsOpen(true)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <Copyright className="w-3.5 h-3.5 text-amber-400" />
                <span>Bản quyền AC Studio</span>
              </button>

              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <LanguageSelector variant="footer" />
              </div>
            </div>

            {/* Bottom row: Official Copyright Notice */}
            <div className="pt-2 text-center text-slate-500 text-[11px] space-y-1">
              <p className="font-medium text-slate-400">
                © 2026 AC Studio. {t.allRightsReserved}.
              </p>
              <p>
                Bộ công cụ Web Calculator phát triển bởi AC Studio. Thiết kế Mobile-First.
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Terms of Service & AC Studio Copyright Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Gemini Right Slide-Over Drawer with Ads (Triggered via `>` button) */}
      <GeminiDrawer
        isOpen={isGeminiDrawerOpen}
        onClose={() => setIsGeminiDrawerOpen(false)}
        currentToolId={currentToolId}
        onSelectTool={handleSelectTool}
        initialToolKey={geminiToolKey}
      />

      {/* Mobile Bottom Tab Bar (5 Primary + "More" Drawer) */}
      <BottomTabBar
        currentToolId={currentToolId}
        onSelectTool={handleSelectTool}
      />

    </div>
  );
}
