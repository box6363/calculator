import React from 'react';
import { 
  Calculator, 
  Sparkles, 
  Activity, 
  Banknote, 
  Wallet, 
  Calendar, 
  Percent, 
  ArrowLeftRight, 
  Triangle, 
  TrendingUp, 
  Home, 
  Car, 
  DollarSign, 
  PiggyBank, 
  LineChart, 
  BarChart3, 
  Ticket, 
  Flame, 
  Scale, 
  Heart, 
  Baby, 
  Footprints, 
  ShieldCheck, 
  Divide, 
  Dice5, 
  Radical, 
  Superscript, 
  Binary, 
  Variable, 
  Square, 
  Box, 
  CircleDot, 
  Circle, 
  Dices, 
  GraduationCap, 
  Ruler, 
  Weight, 
  Thermometer, 
  Coins, 
  Clock, 
  CalendarDays, 
  Receipt, 
  Tag, 
  Building2, 
  KeyRound, 
  Network, 
  Zap, 
  Boxes 
} from 'lucide-react';
import { ToolId } from '../../types';
import { AppLogo } from './AppLogo';

interface ToolIconProps {
  id: ToolId;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ id, className = "w-5 h-5" }) => {
  switch (id) {
    case 'basic': return <AppLogo className={className} />;
    case 'ai': return <Sparkles className={className} />;
    case 'bmi': return <Activity className={className} />;
    case 'loan': return <Banknote className={className} />;
    case 'salary': return <Wallet className={className} />;
    case 'age': return <Calendar className={className} />;
    case 'percentage': return <Percent className={className} />;
    case 'unit': return <ArrowLeftRight className={className} />;
    case 'trigonometry': return <Triangle className={className} />;
    case 'compound': return <TrendingUp className={className} />;
    case 'mortgage': return <Home className={className} />;
    case 'autoloan': return <Car className={className} />;
    case 'interest': return <Percent className={className} />;
    case 'payment': return <DollarSign className={className} />;
    case 'retirement': return <PiggyBank className={className} />;
    case 'amortization': return <LineChart className={className} />;
    case 'investment': return <TrendingUp className={className} />;
    case 'inflation': return <TrendingUp className={className} />;
    case 'finance': return <BarChart3 className={className} />;
    case 'lottery': return <Ticket className={className} />;
    case 'calorie': return <Flame className={className} />;
    case 'bodyfat': return <Activity className={className} />;
    case 'bmr': return <Flame className={className} />;
    case 'idealweight': return <Scale className={className} />;
    case 'healthyweight': return <Heart className={className} />;
    case 'pregnancy': return <Baby className={className} />;
    case 'pace': return <Footprints className={className} />;
    case 'armybodyfat': return <ShieldCheck className={className} />;
    case 'ovulation': return <Heart className={className} />;
    case 'fraction': return <Divide className={className} />;
    case 'triangle': return <Triangle className={className} />;
    case 'standarddeviation': return <BarChart3 className={className} />;
    case 'random': return <Dice5 className={className} />;
    case 'average': return <Calculator className={className} />;
    case 'meanmedianmode': return <BarChart3 className={className} />;
    case 'root': return <Radical className={className} />;
    case 'exponent': return <Superscript className={className} />;
    case 'log': return <Binary className={className} />;
    case 'quadratic': return <Variable className={className} />;
    case 'slope': return <TrendingUp className={className} />;
    case 'area': return <Square className={className} />;
    case 'volume': return <Box className={className} />;
    case 'perimeter': return <CircleDot className={className} />;
    case 'circle': return <Circle className={className} />;
    case 'righttriangle': return <Triangle className={className} />;
    case 'statistics': return <BarChart3 className={className} />;
    case 'probability': return <Dices className={className} />;
    case 'graphing': return <LineChart className={className} />;
    case 'gpa': return <GraduationCap className={className} />;
    case 'length': return <Ruler className={className} />;
    case 'weight': return <Weight className={className} />;
    case 'temperature': return <Thermometer className={className} />;
    case 'currency': return <Coins className={className} />;
    case 'time': return <Clock className={className} />;
    case 'date': return <CalendarDays className={className} />;
    case 'tip': return <Receipt className={className} />;
    case 'discount': return <Tag className={className} />;
    case 'tax': return <Building2 className={className} />;
    case 'password': return <KeyRound className={className} />;
    case 'ipsubnet': return <Network className={className} />;
    case 'utilitybill': return <Zap className={className} />;
    case 'concrete': return <Boxes className={className} />;
    default: return <Calculator className={className} />;
  }
};
