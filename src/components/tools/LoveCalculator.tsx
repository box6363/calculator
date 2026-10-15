import React, { useState, useId } from 'react';
import { 
  Heart, 
  HeartCrack,
  Sparkles, 
  ArrowLeftRight, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Flame, 
  Stars, 
  Smile, 
  Compass, 
  MessageCircleHeart,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Wedding Rings Icon Component
export const WeddingIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    {/* Left ring */}
    <circle cx="8.5" cy="14" r="5" stroke="currentColor" strokeWidth="2.2" />
    {/* Right ring intertwined */}
    <circle cx="15.5" cy="14" r="5" stroke="currentColor" strokeWidth="2.2" />
    {/* Diamond sparkle on left ring */}
    <path d="M8.5 5.5L10.5 7.5L8.5 9.5L6.5 7.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <path d="M6.5 4.5L8.5 2.5L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Helper: Normalize name strings (remove diacritics, trim, lower-case)
function normalizeName(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Deterministic Symmetrical Love Algorithm
function computeLoveScore(nameA: string, nameB: string): {
  total: number;
  romance: number;
  understanding: number;
  communication: number;
  future: number;
} {
  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);
  if (!normA || !normB) {
    return { total: 0, romance: 0, understanding: 0, communication: 0, future: 0 };
  }

  // Symmetrical sorting so NameA + NameB === NameB + NameA
  const [first, second] = [normA, normB].sort();
  const combined = first + second;

  // 1. Character frequency & overlap
  const charSetA = new Set(first.split(''));
  const charSetB = new Set(second.split(''));
  let sharedChars = 0;
  charSetA.forEach(c => {
    if (charSetB.has(c)) sharedChars++;
  });

  // 2. Love letters frequency ("tinhyeu" & "loves")
  const loveTokens = 'lovesromanticamorheart';
  let loveTokenHits = 0;
  for (const ch of combined) {
    if (loveTokens.includes(ch)) loveTokenHits++;
  }

  // 3. Deterministic hash
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Base score from deterministic hash and name harmony (allowing full spectrum 20% .. 98%)
  const hashBase = 22 + (positiveHash % 68);
  const overlapBonus = Math.min(10, sharedChars * 2.5);
  const tokenBonus = Math.min(8, loveTokenHits * 1.5);

  let rawTotal = Math.round(hashBase * 0.88 + overlapBonus + tokenBonus);
  if (rawTotal > 98) rawTotal = 98;
  if (rawTotal < 20) rawTotal = 20;

  // Component breakdown
  const romance = Math.min(99, Math.max(15, Math.round(rawTotal + ((positiveHash % 15) - 7))));
  const understanding = Math.min(99, Math.max(15, Math.round(rawTotal + (((positiveHash >> 2) % 17) - 8))));
  const communication = Math.min(99, Math.max(15, Math.round(rawTotal + (((positiveHash >> 4) % 13) - 6))));
  const future = Math.min(99, Math.max(15, Math.round(rawTotal + (((positiveHash >> 6) % 19) - 9))));

  return {
    total: rawTotal,
    romance,
    understanding,
    communication,
    future
  };
}

// Classic FLAMES algorithm
type FlamesCategory = 'Friendship' | 'Love' | 'Affection' | 'Marriage' | 'Enemy' | 'Sibling';

interface FlamesResult {
  letter: string;
  category: FlamesCategory;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  color: string;
}

function computeFlames(nameA: string, nameB: string): FlamesResult {
  let aChars = normalizeName(nameA).split('');
  let bChars = normalizeName(nameB).split('');

  // Strike out common letters
  for (let i = 0; i < aChars.length; i++) {
    const char = aChars[i];
    const matchIndex = bChars.indexOf(char);
    if (matchIndex !== -1) {
      aChars.splice(i, 1);
      bChars.splice(matchIndex, 1);
      i--;
    }
  }

  const remainingCount = aChars.length + bChars.length;
  const flamesLetters = ['F', 'L', 'A', 'M', 'E', 'S'];

  if (remainingCount === 0) {
    return {
      letter: 'L',
      category: 'Love',
      titleVi: 'Tình yêu nồng cháy (Love)',
      titleEn: 'True Love',
      descVi: 'Hai bạn sinh ra là để dành cho nhau, mối liên kết sâu sắc không thể tách rời.',
      descEn: 'You are meant for each other with an unbreakable romantic bond.',
      color: 'text-rose-500'
    };
  }

  let list = [...flamesLetters];
  let ptr = 0;
  while (list.length > 1) {
    ptr = (ptr + remainingCount - 1) % list.length;
    list.splice(ptr, 1);
  }

  const letter = list[0];
  switch (letter) {
    case 'F':
      return {
        letter: 'F',
        category: 'Friendship',
        titleVi: 'Tình bạn tri kỷ (Friendship)',
        titleEn: 'Enduring Friendship',
        descVi: 'Mối quan hệ bắt đầu từ sự sẻ chia, tin cậy tuyệt đối và luôn là chỗ dựa bình yên.',
        descEn: 'A deep, unbreakable bond founded on honesty, trust, and companionship.',
        color: 'text-sky-500'
      };
    case 'L':
      return {
        letter: 'L',
        category: 'Love',
        titleVi: 'Tình yêu say đắm (Love)',
        titleEn: 'Romantic Love',
        descVi: 'Trái tim hai bạn cùng chung nhịp đập, sự gắn kết lãng mạn đầy đam mê và cảm xúc.',
        descEn: 'Electrifying romantic attraction with mutual tenderness and passion.',
        color: 'text-rose-500'
      };
    case 'A':
      return {
        letter: 'A',
        category: 'Affection',
        titleVi: 'Quý mến & Trân trọng (Affection)',
        titleEn: 'Deep Affection',
        descVi: 'Sự quan tâm ấm áp, ánh nhìn trìu mến và sự thấu cảm nhẹ nhàng dành cho nhau.',
        descEn: 'Gentle warmth, deep admiration, and protective fond tenderness.',
        color: 'text-amber-500'
      };
    case 'M':
      return {
        letter: 'M',
        category: 'Marriage',
        titleVi: 'Đơm hoa kết trái (Marriage)',
        titleEn: 'Destined Marriage',
        descVi: 'Điềm báo về một tình yêu viên mãn, chung đôi đến đầu bạc răng long.',
        descEn: 'Destined lifetime commitment, lifelong harmony, and domestic happiness.',
        color: 'text-emerald-500'
      };
    case 'E':
      return {
        letter: 'E',
        category: 'Enemy',
        titleVi: 'Oan gia ngõ hẹp (Enemy / Opposites)',
        titleEn: 'Passionate Sparks & Opposites',
        descVi: 'Khắc khẩu nhưng lại hút nhau mãnh liệt, đúng chuẩn "ghét của nào trời trao của nấy"!',
        descEn: 'Frequent playful bickering masking magnetic, undeniable underlying attraction.',
        color: 'text-purple-500'
      };
    case 'S':
    default:
      return {
        letter: 'S',
        category: 'Sibling',
        titleVi: 'Thân thiết như người nhà (Sibling / Kinship)',
        titleEn: 'Soul Kinship',
        descVi: 'Cảm giác thân quen từ kiếp trước, thoải mái và không chút khoảng cách hay ngượng ngùng.',
        descEn: 'Natural kinship where you feel instantly at home with one another.',
        color: 'text-teal-500'
      };
  }
}

// Zodiac compatibility lookup table with detailed astrological elements & affinities
export interface ZodiacSignInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  elementVi: string;
  elementEn: string;
  icon: string;
  index: number;
}

const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { id: 'aries', nameVi: 'Bạch Dương (21/3 - 19/4)', nameEn: 'Aries', element: 'fire', elementVi: 'Lửa 🔥', elementEn: 'Fire 🔥', icon: '♈', index: 0 },
  { id: 'taurus', nameVi: 'Kim Ngưu (20/4 - 20/5)', nameEn: 'Taurus', element: 'earth', elementVi: 'Đất 🌍', elementEn: 'Earth 🌍', icon: '♉', index: 1 },
  { id: 'gemini', nameVi: 'Song Tử (21/5 - 21/6)', nameEn: 'Gemini', element: 'air', elementVi: 'Khí 💨', elementEn: 'Air 💨', icon: '♊', index: 2 },
  { id: 'cancer', nameVi: 'Cự Giải (22/6 - 22/7)', nameEn: 'Cancer', element: 'water', elementVi: 'Nước 💧', elementEn: 'Water 💧', icon: '♋', index: 3 },
  { id: 'leo', nameVi: 'Sư Tử (23/7 - 22/8)', nameEn: 'Leo', element: 'fire', elementVi: 'Lửa 🔥', elementEn: 'Fire 🔥', icon: '♌', index: 4 },
  { id: 'virgo', nameVi: 'Xử Nữ (23/8 - 22/9)', nameEn: 'Virgo', element: 'earth', elementVi: 'Đất 🌍', elementEn: 'Earth 🌍', icon: '♍', index: 5 },
  { id: 'libra', nameVi: 'Thiên Bình (23/9 - 23/10)', nameEn: 'Libra', element: 'air', elementVi: 'Khí 💨', elementEn: 'Air 💨', icon: '♎', index: 6 },
  { id: 'scorpio', nameVi: 'Bọ Cạp (24/10 - 22/11)', nameEn: 'Scorpio', element: 'water', elementVi: 'Nước 💧', elementEn: 'Water 💧', icon: '♏', index: 7 },
  { id: 'sagittarius', nameVi: 'Nhân Mã (23/11 - 21/12)', nameEn: 'Sagittarius', element: 'fire', elementVi: 'Lửa 🔥', elementEn: 'Fire 🔥', icon: '♐', index: 8 },
  { id: 'capricorn', nameVi: 'Ma Kết (22/12 - 19/1)', nameEn: 'Capricorn', element: 'earth', elementVi: 'Đất 🌍', elementEn: 'Earth 🌍', icon: '♑', index: 9 },
  { id: 'aquarius', nameVi: 'Bảo Bình (20/1 - 18/2)', nameEn: 'Aquarius', element: 'air', elementVi: 'Khí 💨', elementEn: 'Air 💨', icon: '♒', index: 10 },
  { id: 'pisces', nameVi: 'Song Ngư (19/2 - 20/3)', nameEn: 'Pisces', element: 'water', elementVi: 'Nước 💧', elementEn: 'Water 💧', icon: '♓', index: 11 }
];

export interface ZodiacCompatibilityResult {
  sign1: ZodiacSignInfo;
  sign2: ZodiacSignInfo;
  score: number;
  elementMatchVi: string;
  elementMatchEn: string;
  analysisVi: string;
  analysisEn: string;
  romanceBonus: number;
  understandingBonus: number;
  communicationBonus: number;
  futureBonus: number;
}

function computeZodiacCompatibility(z1Id: string, z2Id: string): ZodiacCompatibilityResult {
  const sign1 = ZODIAC_SIGNS.find(s => s.id === z1Id) || ZODIAC_SIGNS[0];
  const sign2 = ZODIAC_SIGNS.find(s => s.id === z2Id) || ZODIAC_SIGNS[1];

  const diff = Math.abs(sign1.index - sign2.index);
  const distance = Math.min(diff, 12 - diff);

  let score = 75;
  let elementMatchVi = '';
  let elementMatchEn = '';
  let analysisVi = '';
  let analysisEn = '';
  let romanceBonus = 0;
  let understandingBonus = 0;
  let communicationBonus = 0;
  let futureBonus = 0;

  if (distance === 0) {
    score = 88;
    elementMatchVi = `Cùng cung ${sign1.nameVi.split(' ')[0]} – Đồng điệu tuyệt đối`;
    elementMatchEn = `Same Sign (${sign1.nameEn}) – Soul Twin Mirror`;
    analysisVi = `Hai bạn giống như hai nửa của một tấm gương, hiểu rõ từng suy nghĩ và thói quen của nhau. Tình yêu bền chặt vì luôn tìm thấy sự đồng cảm sâu sắc.`;
    analysisEn = `You mirror each other's strengths and habits naturally, forming an empathetic, kindred connection.`;
    understandingBonus = 8;
    futureBonus = 5;
  } else if (sign1.element === sign2.element) {
    if (sign1.element === 'fire') {
      score = 95;
      elementMatchVi = 'Song Hỏa (Lửa + Lửa) – Đam mê bùng nổ 🔥';
      elementMatchEn = 'Double Fire – Fiery Passion & High Energy 🔥';
      analysisVi = 'Hai ngọn lửa gặp nhau tạo nên tình yêu rực cháy, mãnh liệt và tràn đầy nhiệt huyết. Cả hai đều thẳng thắn, hào phóng và không ngại bày tỏ cảm xúc.';
      analysisEn = 'Dynamic, adventurous, and fiercely passionate. You fuel each other’s ambitions with unyielding enthusiasm.';
      romanceBonus = 10;
      futureBonus = 6;
    } else if (sign1.element === 'water') {
      score = 96;
      elementMatchVi = 'Song Thủy (Nước + Nước) – Giao cảm tâm linh 💧';
      elementMatchEn = 'Double Water – Deep Intuitive Soul Connection 💧';
      analysisVi = 'Sợi dây tình cảm gắn kết vô cùng bền chặt. Hai bạn có khả năng thần giao cách cảm, lắng nghe và chữa lành tâm hồn cho nhau một cách nhẹ nhàng.';
      analysisEn = 'Profound emotional depth, natural telepathy, and poetic tenderness. You create a safe sanctuary together.';
      understandingBonus = 10;
      romanceBonus = 8;
    } else if (sign1.element === 'earth') {
      score = 93;
      elementMatchVi = 'Song Thổ (Đất + Đất) – Vững chãi trọn đời 🌍';
      elementMatchEn = 'Double Earth – Rock-Solid Stability 🌍';
      analysisVi = 'Mối tình thực tế, thủy chung và bình yên. Cả hai cùng hướng tới những giá trị vững chắc, cùng vun đắp mái ấm và tích lũy tương lai viên mãn.';
      analysisEn = 'Loyal, grounded, and dependable. You share mutual values of security, dedication, and lasting commitment.';
      futureBonus = 10;
      understandingBonus = 7;
    } else {
      score = 94;
      elementMatchVi = 'Song Khí (Khí + Khí) – Tâm đầu ý hợp 💨';
      elementMatchEn = 'Double Air – Intellectual Harmony & Playful Wit 💨';
      analysisVi = 'Cặp đôi hòa hợp tuyệt vời về mặt tư duy. Những cuộc trò chuyện không bao giờ cạn đề tài, tình yêu tự do, vui tươi và tràn ngập tiếng cười.';
      analysisEn = 'Endless stimulating conversations, mutual social charm, and boundless intellectual chemistry.';
      communicationBonus = 10;
      romanceBonus = 6;
    }
  } else if (
    (sign1.element === 'fire' && sign2.element === 'air') ||
    (sign1.element === 'air' && sign2.element === 'fire')
  ) {
    score = distance === 6 ? 89 : 92;
    elementMatchVi = 'Hỏa & Khí (Lửa + Gió) – Thổi bùng đam mê 🌟';
    elementMatchEn = 'Fire & Air – Radiant Synergy & Excitement 🌟';
    analysisVi = 'Không khí thổi bùng ngọn lửa! Sự thông minh, linh hoạt của cung Khí kết hợp hoàn hảo với sự nhiệt thành, quả cảm của cung Lửa, tạo nên một tình yêu rạng rỡ và tràn ngập niềm vui.';
    analysisEn = 'Air fuels Fire into a dazzling blaze! An inspiring partnership full of vitality, social magnetism, and adventure.';
    romanceBonus = 8;
    communicationBonus = 8;
  } else if (
    (sign1.element === 'earth' && sign2.element === 'water') ||
    (sign1.element === 'water' && sign2.element === 'earth')
  ) {
    score = distance === 6 ? 88 : 93;
    elementMatchVi = 'Thổ & Thủy (Đất + Nước) – Đơm hoa kết trái 🌸';
    elementMatchEn = 'Earth & Water – Fertile Love & Gentle Devotion 🌸';
    analysisVi = 'Nước tưới mát cho đất cằn, Đất ôm ấp và giữ dòng nước yên bình. Tình yêu phát triển tự nhiên, gắn bó keo sơn và rất giàu tiềm năng đi đến hôn nhân hạnh phúc.';
    analysisEn = 'Water enriches Earth while Earth gives Water structure. A deeply nurturing, deeply committed match bound for longevity.';
    futureBonus = 8;
    understandingBonus = 8;
  } else if (
    (sign1.element === 'fire' && sign2.element === 'water') ||
    (sign1.element === 'water' && sign2.element === 'fire')
  ) {
    score = 68;
    elementMatchVi = 'Hỏa & Thủy (Lửa + Nước) – Thử thách dung hòa 🌊';
    elementMatchEn = 'Fire & Water – Steam & Contrast 🌊';
    analysisVi = 'Lửa và Nước tạo nên sức hút trái dấu đầy bí ẩn. Nước có thể làm Lửa dịu lại, nhưng Lửa quá nóng sẽ làm Nước bốc hơi. Cần sự dịu dàng và kiên nhẫn để tìm thấy nhiệt độ ấm áp lý tưởng.';
    analysisEn = 'Magnetic chemistry with elemental contrast. Fire needs patience, while Water needs confidence to build lasting harmony.';
    romanceBonus = 5;
    understandingBonus = -4;
    communicationBonus = -3;
  } else if (
    (sign1.element === 'earth' && sign2.element === 'fire') ||
    (sign1.element === 'fire' && sign2.element === 'earth')
  ) {
    score = 71;
    elementMatchVi = 'Hỏa & Thổ (Lửa + Đất) – Nung nấu kiên định 🌋';
    elementMatchEn = 'Fire & Earth – Passion Meets Practicality 🌋';
    analysisVi = 'Lửa thích phiêu lưu mạo hiểm, trong khi Đất cần sự an toàn ổn định. Nếu Lửa học cách chậm lại và Đất cởi mở đón nhận điều mới mẻ, hai bạn sẽ là hậu phương vững chắc cho nhau.';
    analysisEn = 'Fire brings excitement while Earth builds security. Striking the balance between impulse and caution makes this thrive.';
    futureBonus = 4;
    communicationBonus = -2;
  } else if (
    (sign1.element === 'air' && sign2.element === 'water') ||
    (sign1.element === 'water' && sign2.element === 'air')
  ) {
    score = 69;
    elementMatchVi = 'Khí & Thủy (Gió + Nước) – Sóng biển mênh mông 🌬️';
    elementMatchEn = 'Air & Water – Intellect Meets Emotion 🌬️';
    analysisVi = 'Gió suy nghĩ bằng lý trí, còn Nước cảm nhận bằng trái tim. Hãy dùng sự chân thành để thấu hiểu thế giới nội tâm của nhau thay vì tranh cãi lý lẽ.';
    analysisEn = 'Air brings logic while Water brings feelings. Listening with empathy bridges the gap between thoughts and emotions.';
    romanceBonus = 4;
    understandingBonus = -2;
  } else {
    score = 66;
    elementMatchVi = 'Thổ & Khí (Đất + Gió) – Cân bằng lý tưởng 🍃';
    elementMatchEn = 'Earth & Air – Pragmatism Meets Ideals 🍃';
    analysisVi = 'Đất thực tế và chú trọng tiểu tiết, còn Gió bay bổng với những ý tưởng lớn. Bằng cách tôn trọng phong cách của nhau, hai bạn sẽ bù đắp hoàn hảo cho những khiếm khuyết.';
    analysisEn = 'Earth keeps Air grounded while Air gives Earth fresh perspectives. Celebrating differences transforms this bond.';
    futureBonus = 3;
    romanceBonus = -2;
  }

  return {
    sign1,
    sign2,
    score,
    elementMatchVi,
    elementMatchEn,
    analysisVi,
    analysisEn,
    romanceBonus,
    understandingBonus,
    communicationBonus,
    futureBonus
  };
}

interface LoveHistoryItem {
  name1: string;
  name2: string;
  score: number;
  time: string;
}

interface LoveCalculatorProps {
  onOpenBlog?: () => void;
}

export const LoveCalculator: React.FC<LoveCalculatorProps> = ({ onOpenBlog }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const name1InputId = useId();
  const name2InputId = useId();

  // Inputs
  const [yourName, setYourName] = useState<string>('');
  const [crushName, setCrushName] = useState<string>('');
  const [zodiac1, setZodiac1] = useState<string>('leo');
  const [zodiac2, setZodiac2] = useState<string>('sagittarius');
  const [showZodiac, setShowZodiac] = useState<boolean>(false);

  // States
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<{
    nameA: string;
    nameB: string;
    score: number;
    nameScore: number;
    romance: number;
    understanding: number;
    communication: number;
    future: number;
    flames: FlamesResult;
    zodiac?: ZodiacCompatibilityResult;
    hasZodiac: boolean;
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<LoveHistoryItem[]>([]);

  // Famous test pairs for quick fun click
  const samplePairs = isVi ? [
    { a: 'Romeo', b: 'Juliet' },
    { a: 'Jack', b: 'Rose' },
    { a: 'Lương Sơn Bá', b: 'Chúc Anh Đài' },
    { a: 'Ngưu Lang', b: 'Chức Nữ' }
  ] : [
    { a: 'Romeo', b: 'Juliet' },
    { a: 'Jack', b: 'Rose' },
    { a: 'Bonnie', b: 'Clyde' },
    { a: 'Noah', b: 'Allie' }
  ];

  // Perform Love Calculation
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!yourName.trim()) {
      const el = document.getElementById(name1InputId);
      el?.focus();
      return;
    }
    if (!crushName.trim()) {
      const el = document.getElementById(name2InputId);
      el?.focus();
      return;
    }

    setIsCalculating(true);
    setCopied(false);

    // Smooth calculation transition
    setTimeout(() => {
      const nameScores = computeLoveScore(yourName, crushName);
      const flames = computeFlames(yourName, crushName);
      const zodiacComp = computeZodiacCompatibility(zodiac1, zodiac2);

      let finalScore = nameScores.total;
      let finalRomance = nameScores.romance;
      let finalUnderstanding = nameScores.understanding;
      let finalCommunication = nameScores.communication;
      let finalFuture = nameScores.future;

      if (showZodiac) {
        // Blend 50% name vibration + 50% astrological compatibility so changing zodiac immediately changes results
        finalScore = Math.min(99, Math.max(50, Math.round(nameScores.total * 0.5 + zodiacComp.score * 0.5)));
        finalRomance = Math.min(99, Math.max(45, Math.round(nameScores.romance * 0.5 + (zodiacComp.score + zodiacComp.romanceBonus) * 0.5)));
        finalUnderstanding = Math.min(99, Math.max(45, Math.round(nameScores.understanding * 0.5 + (zodiacComp.score + zodiacComp.understandingBonus) * 0.5)));
        finalCommunication = Math.min(99, Math.max(45, Math.round(nameScores.communication * 0.5 + (zodiacComp.score + zodiacComp.communicationBonus) * 0.5)));
        finalFuture = Math.min(99, Math.max(45, Math.round(nameScores.future * 0.5 + (zodiacComp.score + zodiacComp.futureBonus) * 0.5)));
      }

      const result = {
        nameA: yourName.trim(),
        nameB: crushName.trim(),
        score: finalScore,
        nameScore: nameScores.total,
        romance: finalRomance,
        understanding: finalUnderstanding,
        communication: finalCommunication,
        future: finalFuture,
        flames,
        zodiac: showZodiac ? zodiacComp : undefined,
        hasZodiac: showZodiac
      };

      setCalculatedResult(result);
      setIsCalculating(false);

      // Add to history
      const historyTitle1 = showZodiac ? `${yourName.trim()} (${zodiacComp.sign1.icon})` : yourName.trim();
      const historyTitle2 = showZodiac ? `${crushName.trim()} (${zodiacComp.sign2.icon})` : crushName.trim();

      setHistory(prev => [
        {
          name1: historyTitle1,
          name2: historyTitle2,
          score: finalScore,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.slice(0, 5)
      ]);
    }, 600);
  };

  // Swap names
  const handleSwap = () => {
    const temp = yourName;
    setYourName(crushName);
    setCrushName(temp);
  };

  // Copy result card
  const handleCopyResult = () => {
    if (!calculatedResult) return;
    const isWed = calculatedResult.score >= 50;
    const outcomeLine = isVi
      ? (isWed ? '💍 Kết quả: Đám cưới viên mãn' : '💔 Kết quả: Nguy cơ đổ vỡ / rạn nứt')
      : (isWed ? '💍 Verdict: Destined Wedding' : '💔 Verdict: High Heartbreak Risk');

    const text = isVi
      ? `💘 KẾT QUẢ MÁY TÍNH TÌNH YÊU 💘\n${calculatedResult.nameA} ${isWed ? '❤️💍' : '💔'} ${calculatedResult.nameB}${calculatedResult.hasZodiac && calculatedResult.zodiac ? `\nCung hoàng đạo: ${calculatedResult.zodiac.sign1.nameVi.split(' ')[0]} ${calculatedResult.zodiac.sign1.icon} & ${calculatedResult.zodiac.sign2.nameVi.split(' ')[0]} ${calculatedResult.zodiac.sign2.icon} (Hợp cung: ${calculatedResult.zodiac.score}%)` : ''}\nĐộ hòa hợp: ${calculatedResult.score}%${calculatedResult.hasZodiac ? ` (Tên: ${calculatedResult.nameScore}% | Cung: ${calculatedResult.zodiac?.score}%)` : ''}\n${outcomeLine}\n- Lãng mạn: ${calculatedResult.romance}%\n- Thấu hiểu: ${calculatedResult.understanding}%\n- Giao tiếp: ${calculatedResult.communication}%\n- Gắn kết lâu dài: ${calculatedResult.future}%\nBói FLAMES: ${calculatedResult.flames.titleVi}\nTính tại Web Calculator!`
      : `💘 LOVE CALCULATOR MATCH 💘\n${calculatedResult.nameA} ${isWed ? '❤️💍' : '💔'} ${calculatedResult.nameB}${calculatedResult.hasZodiac && calculatedResult.zodiac ? `\nZodiac signs: ${calculatedResult.zodiac.sign1.nameEn} ${calculatedResult.zodiac.sign1.icon} & ${calculatedResult.zodiac.sign2.nameEn} ${calculatedResult.zodiac.sign2.icon} (${calculatedResult.zodiac.score}% match)` : ''}\nOverall Match: ${calculatedResult.score}%${calculatedResult.hasZodiac ? ` (Name: ${calculatedResult.nameScore}% | Zodiac: ${calculatedResult.zodiac?.score}%)` : ''}\n${outcomeLine}\n- Romance: ${calculatedResult.romance}%\n- Understanding: ${calculatedResult.understanding}%\n- Communication: ${calculatedResult.communication}%\n- Future: ${calculatedResult.future}%\nFLAMES: ${calculatedResult.flames.titleEn}\nCalculated at Web Calculator!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get Verdict (>= 50%: Wedding 💍, < 50%: Breakup / Fractured 💔)
  const getVerdict = (score: number) => {
    const isWedding = score >= 50;

    if (score >= 85) {
      return {
        isWedding: true,
        type: 'wedding' as const,
        badgeText: isVi ? 'Đám Cưới Viên Mãn 💍' : 'Destined Wedding 💍',
        title: isVi ? 'Đám Cưới Thế Kỷ & Mối Duyên Tiền Định 💍' : 'Century Wedding & Destined Soulmates 💍',
        desc: isVi 
          ? 'Tỷ lệ hòa hợp tuyệt đối! Hai bạn sinh ra là để dành cho nhau, mối liên kết sâu sắc và sự thấu cảm kỳ lạ hướng thẳng tới một đám cưới trong mơ và cuộc sống hôn nhân viên mãn trọn đời.'
          : 'Incredible cosmic chemistry! You are destined for a fairytale wedding and a lifelong joyful marriage.',
        gaugeGradient: 'from-amber-400 via-rose-500 to-pink-500',
        badgeBg: 'bg-amber-500/15 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
      };
    } else if (score >= 68) {
      return {
        isWedding: true,
        type: 'wedding' as const,
        badgeText: isVi ? 'Hôn Nhân Hạnh Phúc 💍' : 'Joyful Marriage 💍',
        title: isVi ? 'Cặp Đôi Ngọt Ngào & Hướng Tới Đám Cưới 💍' : 'Passionate Love & Future Wedding 💍',
        desc: isVi
          ? 'Tình yêu tràn đầy sức sống và sự lãng mạn. Hai bạn dễ dàng tìm thấy tiếng nói chung, tôn trọng lẫn nhau và cùng nhau xây dựng tổ ấm hạnh phúc vững bền.'
          : 'High compatibility and strong romantic attraction. A beautiful foundation leading to a happy wedding.',
        gaugeGradient: 'from-rose-500 to-amber-400',
        badgeBg: 'bg-rose-500/15 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
      };
    } else if (score >= 50) {
      return {
        isWedding: true,
        type: 'wedding' as const,
        badgeText: isVi ? 'Tiềm Năng Đám Cưới 💍' : 'Wedding Potential 💍',
        title: isVi ? 'Hòa Hợp & Cùng Nhau Tiến Tới Lễ Đường 💍' : 'Harmonious Bond & Wedding Bound 💍',
        desc: isVi
          ? 'Đạt trên ngưỡng hòa hợp lý tưởng! Chỉ cần hai bạn chủ động chia sẻ, lắng nghe và thấu cảm nhiều hơn, mối tình này hoàn toàn có thể đơm hoa kết trái bằng một đám cưới ấm cúng.'
          : 'Above the compatibility threshold! Mutual patience and dedication will guide this relationship straight to the wedding altar.',
        gaugeGradient: 'from-pink-500 to-rose-400',
        badgeBg: 'bg-pink-500/15 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300'
      };
    } else if (score >= 35) {
      return {
        isWedding: false,
        type: 'breakup' as const,
        badgeText: isVi ? 'Nguy Cơ Đổ Vỡ 💔' : 'Heartbreak Risk 💔',
        title: isVi ? 'Dễ Rạn Nứt & Xung Đột Quan Điểm 💔' : 'Tension & Heartbreak Risk 💔',
        desc: isVi
          ? 'Dưới ngưỡng 50% - Mối quan hệ có dấu hiệu rạn nứt do sự bất đồng về tính cách hoặc quan điểm sống. Cần hạ bớt cái tôi và thực sự thấu hiểu nếu không muốn tình cảm đổ vỡ.'
          : 'Under 50% - Noticeable emotional friction and differing viewpoints. Without active listening and compromise, this bond faces serious risk of heartbreak.',
        gaugeGradient: 'from-slate-500 via-rose-600 to-red-600',
        badgeBg: 'bg-rose-500/15 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
      };
    } else {
      return {
        isWedding: false,
        type: 'breakup' as const,
        badgeText: isVi ? 'Đổ Vỡ & Xung Khắc 💔' : 'Fractured Bond 💔',
        title: isVi ? 'Báo Động Đổ Vỡ & Khác Biệt Quá Lớn 💔' : 'High Heartbreak Danger & Incompatibility 💔',
        desc: isVi
          ? 'Tần số cảm xúc có sự đối kháng mạnh mẽ. Hai bạn như hai đường thẳng song song, liên tục xảy ra mâu thuẫn khiến mối quan hệ rạn nứt sâu sắc và đứng trước nguy cơ đổ vỡ hoàn toàn.'
          : 'Severe clash of personalities and values. The emotional gap requires monumental patience and healing to prevent a total breakup.',
        gaugeGradient: 'from-zinc-600 to-rose-700',
        badgeBg: 'bg-red-500/15 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
      };
    }
  };

  const verdict = calculatedResult ? getVerdict(calculatedResult.score) : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* 1. Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/60 shadow-xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>{isVi ? 'Đo độ hợp đôi chính xác theo họ tên' : 'True Love & Compatibility Test'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isVi ? 'Máy Tính Tình Yêu (Love Calculator)' : 'Love Calculator & Chemistry Match'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {isVi 
            ? 'Khám phá mức độ tương thích, chỉ số lãng mạn và tiềm năng gắn kết lâu dài giữa bạn và người ấy.'
            : 'Discover love compatibility, romantic chemistry, and destiny potential between two names.'}
        </p>
      </div>

      {/* 2. Main Hero Love Heart Matcher Card (Matches the User's Provided Image) */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 transition-all">
        {/* Soft Pink Heart Watermark Graphic centered in the background */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-40 dark:opacity-20 transition-opacity"
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] text-rose-200 dark:text-rose-600/30 fill-current"
          >
            <path d="M50,88.9 C22,65 5,48 5,30 C5,16 16,5 30,5 C38.5,5 46,9 50,15.5 C54,9 61.5,5 70,5 C84,5 95,16 95,30 C95,48 78,65 50,88.9 Z" />
          </svg>
        </div>

        {/* Foreground Interactive Form */}
        <form onSubmit={handleCalculate} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center">
            {/* Left: Your Name */}
            <div className="space-y-2">
              <label htmlFor={name1InputId} className="block text-center sm:text-left text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isVi ? 'Tên của bạn (Your name)' : 'Your name'}
              </label>
              <div className="relative">
                <input
                  id={name1InputId}
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder={isVi ? 'Họ và tên đầy đủ' : 'Full name'}
                  maxLength={50}
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  style={{
                    backgroundColor: '#ffffff',
                    background: '#ffffff',
                    color: '#0f172a',
                    WebkitTextFillColor: '#0f172a',
                    WebkitBoxShadow: '0 0 0px 1000px #ffffff inset'
                  }}
                  className="love-white-pill-input w-full text-center sm:text-left px-5 py-3.5 text-base sm:text-lg font-semibold rounded-full border-2 border-slate-200/90 shadow-md focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all"
                  required
                />
                {yourName && (
                  <button
                    type="button"
                    onClick={() => setYourName('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Xóa tên bạn"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Right: Your Crush */}
            <div className="space-y-2">
              <label htmlFor={name2InputId} className="block text-center sm:text-left text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isVi ? 'Tên người ấy (Your crush)' : 'Your crush'}
              </label>
              <div className="relative">
                <input
                  id={name2InputId}
                  type="text"
                  value={crushName}
                  onChange={(e) => setCrushName(e.target.value)}
                  placeholder={isVi ? 'Họ và tên đầy đủ' : 'Full name'}
                  maxLength={50}
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  style={{
                    backgroundColor: '#ffffff',
                    background: '#ffffff',
                    color: '#0f172a',
                    WebkitTextFillColor: '#0f172a',
                    WebkitBoxShadow: '0 0 0px 1000px #ffffff inset'
                  }}
                  className="love-white-pill-input w-full text-center sm:text-left px-5 py-3.5 text-base sm:text-lg font-semibold rounded-full border-2 border-slate-200/90 shadow-md focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all"
                  required
                />
                {crushName && (
                  <button
                    type="button"
                    onClick={() => setCrushName('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Xóa tên crush"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Swap and Zodiac Toggle Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!yourName && !crushName}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isVi ? 'Đổi chỗ hai tên' : 'Swap names'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowZodiac(!showZodiac)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                showZodiac 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Stars className="w-3.5 h-3.5" />
              <span>{isVi ? 'Thêm Cung hoàng đạo' : 'Add Zodiac signs'}</span>
            </button>
          </div>

          {/* Optional Zodiac Selector */}
          {showZodiac && (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isVi ? 'Cung của bạn' : 'Your Zodiac'}
                </label>
                <select
                  value={zodiac1}
                  onChange={(e) => setZodiac1(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {ZODIAC_SIGNS.map(z => (
                    <option key={`z1-${z.id}`} value={z.id}>
                      {z.icon} {isVi ? z.nameVi : z.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isVi ? 'Cung của người ấy' : 'Crush Zodiac'}
                </label>
                <select
                  value={zodiac2}
                  onChange={(e) => setZodiac2(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {ZODIAC_SIGNS.map(z => (
                    <option key={`z2-${z.id}`} value={z.id}>
                      {z.icon} {isVi ? z.nameVi : z.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Center Pill Button: "Calculate love" (White background, black text, deep red heart) */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={isCalculating}
              className="love-calculate-pill-btn group relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-black text-base sm:text-lg border-2 border-slate-300 hover:border-slate-400 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                background: '#ffffff',
                color: '#000000',
                opacity: 1,
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.04)'
              }}
            >
              <Heart 
                className={`w-5 h-5 shrink-0 ${isCalculating ? 'animate-ping' : 'group-hover:scale-115 transition-transform'}`} 
                style={{ fill: '#b91c1c', color: '#991b1b', opacity: 1 }}
              />
              <span 
                className="font-black tracking-wide text-black" 
                style={{ color: '#000000', opacity: 1, fontWeight: 900 }}
              >
                {isCalculating ? (isVi ? 'Đang tính toán...' : 'Calculating love...') : 'Calculate love'}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Sample Couples */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-600 dark:text-slate-400 mr-2">
            {isVi ? 'Thử nhanh cặp đôi:' : 'Quick sample couples:'}
          </span>
          <div className="inline-flex flex-wrap justify-center gap-1.5 mt-2 sm:mt-0">
            {samplePairs.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setYourName(p.a);
                  setCrushName(p.b);
                }}
                className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {p.a} ❤️ {p.b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Detailed Results Showcase */}
      {calculatedResult && verdict && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Main Verdict Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  {/* Couple Title */}
                  <div className="text-center sm:text-left space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                      {isVi ? 'Kết quả tương thích' : 'Compatibility Verdict'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                      <span>{calculatedResult.nameA}</span>
                      {verdict.isWedding ? (
                        <span className="inline-flex items-center gap-1">
                          <Heart className="w-5 h-5 fill-rose-500 text-rose-500 inline-block animate-bounce" />
                          <WeddingIcon className="w-5 h-5 inline-block text-amber-500" />
                        </span>
                      ) : (
                        <HeartCrack className="w-6 h-6 fill-rose-600 text-rose-600 inline-block animate-pulse" />
                      )}
                      <span>{calculatedResult.nameB}</span>
                    </h2>

                    {/* Zodiac Sub-Indicator if enabled */}
                    {calculatedResult.hasZodiac && calculatedResult.zodiac && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                          {isVi ? `Điểm theo Tên: ${calculatedResult.nameScore}%` : `Name: ${calculatedResult.nameScore}%`}
                        </span>
                        <span>+</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60">
                          {calculatedResult.zodiac.sign1.icon} & {calculatedResult.zodiac.sign2.icon}: {calculatedResult.zodiac.score}%
                        </span>
                      </div>
                    )}

                    {/* Verdict Outcome Pill Badge */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${verdict.badgeBg}`}>
                        {verdict.isWedding ? (
                          <WeddingIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <HeartCrack className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        )}
                        <span>{verdict.badgeText}</span>
                      </div>
                      <span className={`text-sm font-bold ${verdict.isWedding ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'}`}>
                        {verdict.title}
                      </span>
                    </div>
                  </div>

                  {/* Big Circular Percentage Gauge with Wedding / Breakup Badge */}
                  <div className="flex flex-col items-center">
                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-gradient-to-tr ${verdict.gaugeGradient} p-1.5 shadow-lg ${verdict.isWedding ? 'shadow-amber-500/25' : 'shadow-rose-900/30'}`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center p-2">
                        <span className={`text-3xl sm:text-4xl font-black tracking-tight ${verdict.isWedding ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                          {calculatedResult.score}%
                        </span>
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider mt-0.5">
                          {verdict.isWedding ? (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <WeddingIcon className="w-3.5 h-3.5 text-amber-500" />
                              <span>{isVi ? 'Đám cưới' : 'Wedding'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <HeartCrack className="w-3.5 h-3.5 text-rose-500" />
                              <span>{isVi ? 'Đổ vỡ' : 'Breakup'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verdict Explanation Text */}
                <div className="py-4">
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {verdict.desc}
                  </p>
                </div>

            {/* 4 Core Dimensions Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* 1. Romance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    {isVi ? 'Lãng mạn & Say đắm' : 'Romance & Chemistry'}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold">{calculatedResult.romance}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700" 
                    style={{ width: `${calculatedResult.romance}%` }}
                  />
                </div>
              </div>

              {/* 2. Understanding */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    {isVi ? 'Thấu hiểu & Tâm đầu ý hợp' : 'Mutual Understanding'}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">{calculatedResult.understanding}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700" 
                    style={{ width: `${calculatedResult.understanding}%` }}
                  />
                </div>
              </div>

              {/* 3. Communication */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <MessageCircleHeart className="w-3.5 h-3.5 text-sky-500" />
                    {isVi ? 'Giao tiếp & Hòa giải' : 'Communication & Harmony'}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold">{calculatedResult.communication}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-700" 
                    style={{ width: `${calculatedResult.communication}%` }}
                  />
                </div>
              </div>

              {/* 4. Future */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-500" />
                    {isVi ? 'Tiềm năng gắn kết lâu dài' : 'Future & Commitment'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{calculatedResult.future}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700" 
                    style={{ width: `${calculatedResult.future}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Zodiac Compatibility Feature (when enabled) */}
            {calculatedResult.hasZodiac && calculatedResult.zodiac && (
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-slate-800/90 dark:to-slate-800/50 border border-purple-200/80 dark:border-purple-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Stars className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {isVi ? 'Tương hợp Cung Hoàng Đạo & Chiêm Tinh' : 'Zodiac & Elemental Compatibility'}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-xs">
                    <span>{isVi ? 'Độ hợp cung:' : 'Zodiac Match:'}</span>
                    <span className="text-sm font-black text-rose-500">{calculatedResult.zodiac.score}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700 shadow-xs">
                    <span className="text-base">{calculatedResult.zodiac.sign1.icon}</span>
                    <span>{isVi ? calculatedResult.zodiac.sign1.nameVi.split(' ')[0] : calculatedResult.zodiac.sign1.nameEn} ({isVi ? calculatedResult.zodiac.sign1.elementVi : calculatedResult.zodiac.sign1.elementEn})</span>
                  </span>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700 shadow-xs">
                    <span className="text-base">{calculatedResult.zodiac.sign2.icon}</span>
                    <span>{isVi ? calculatedResult.zodiac.sign2.nameVi.split(' ')[0] : calculatedResult.zodiac.sign2.nameEn} ({isVi ? calculatedResult.zodiac.sign2.elementVi : calculatedResult.zodiac.sign2.elementEn})</span>
                  </span>
                </div>

                <div className="inline-block text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/60 px-2.5 py-1 rounded-md">
                  {isVi ? calculatedResult.zodiac.elementMatchVi : calculatedResult.zodiac.elementMatchEn}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isVi ? calculatedResult.zodiac.analysisVi : calculatedResult.zodiac.analysisEn}
                </p>
              </div>
            )}

            {/* FLAMES Bonus Feature */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-rose-200/70 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {isVi ? 'Bói tình duyên kinh điển FLAMES' : 'Classic FLAMES Game Result'}
                </span>
              </div>
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                {isVi ? calculatedResult.flames.titleVi : calculatedResult.flames.titleEn}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isVi ? calculatedResult.flames.descVi : calculatedResult.flames.descEn}
              </p>
            </div>

            {/* Legal Advisory & Disclaimer Box directly under result */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/50 flex items-start gap-3 text-left">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
                <div className="font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-400">
                  {isVi ? 'Khuyến cáo & Miễn trừ trách nhiệm' : 'Legal Disclaimer & Advisory'}
                </div>
                <p className="leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                  {isVi
                    ? 'Kết quả tính toán trên chỉ mang tính chất tham khảo & giải trí. Chúng tôi không chịu trách nhiệm về bất kỳ quyết định cá nhân, tranh chấp hay các hậu quả liên quan phát sinh từ việc sử dụng các thông tin này.'
                    : 'The calculation results above are strictly for reference and recreational entertainment. We assume no responsibility or liability for any personal decisions, disputes, or related consequences arising from the use of this information.'}
                </p>
              </div>
            </div>

            {/* Action Bar (Copy & Reset) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCopyResult}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isVi ? 'Đã sao chép kết quả!' : 'Copied!') : (isVi ? 'Sao chép kết quả chia sẻ' : 'Copy result')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setYourName('');
                  setCrushName('');
                  setCalculatedResult(null);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isVi ? 'Tính cặp đôi khác' : 'Test another couple'}</span>
              </button>
            </div>
          </div>

          {/* 4. Match History */}
          {history.length > 1 && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isVi ? 'Lịch sử ghép đôi gần đây' : 'Recent Matches'}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-xs sm:text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.name1} {item.score >= 50 ? '❤️' : '💔'} {item.name2}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.score >= 50 ? 'text-rose-500' : 'text-slate-500'}`}>{item.score}%</span>
                      {item.score >= 50 ? (
                        <WeddingIcon className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <HeartCrack className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="text-slate-400 text-[11px]">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Educational / Fun Guide Section & Link to Blog */}
      <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 border border-pink-500/20 p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>{isVi ? 'Khám Phá Cẩm Nang & Giải Mã Thuật Toán Tình Yêu' : 'Explore Love Calculator & Romance Guides'}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isVi 
                ? 'Tìm hiểu chi tiết về cơ chế tính điểm đối xứng, giải mã bói FLAMES và thần số học họ tên trên chuyên mục Blog.'
                : 'Learn the math behind symmetrical matching, the classic FLAMES algorithm, and name numerology on our blog.'}
            </p>
          </div>
          {onOpenBlog && (
            <button
              onClick={onOpenBlog}
              type="button"
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>{isVi ? 'Đọc Blog Tình Yêu' : 'Read Love Blog'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="pt-3 border-t border-pink-500/10 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{isVi ? 'Nguyên lý hoạt động của máy tính tình yêu' : 'How does the Love Calculator work?'}</span>
          </h5>
          <p>
            {isVi
              ? 'Máy tính tình yêu phân tích tần số tương đồng giữa hai họ tên, kết hợp giải thuật số học tình duyên đối xứng và bộ lọc ký tự tình yêu truyền thống. Kết quả mang tính chất giải trí, gắn kết và gợi mở những góc nhìn thú vị cho các cặp đôi.'
              : 'The Love Calculator analyzes name harmonics and character frequencies using a deterministic symmetric algorithm. Designed for entertainment, romance, and sharing joyful moments together.'}
          </p>
        </div>
      </div>

      {/* 6. Legal Disclaimer Footer - Chuẩn Pháp Lý & Tuyên Bố Miễn Trừ Trách Nhiệm */}
      <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 p-4 sm:p-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="uppercase tracking-wider text-[11px] sm:text-xs">
            {isVi ? 'Tuyên bố miễn trừ trách nhiệm pháp lý (Legal Disclaimer)' : 'Comprehensive Legal Disclaimer'}
          </span>
        </div>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400 text-xs sm:text-[13px]">
          {isVi
            ? 'Kết quả chỉ mang tính chất tham khảo và giải trí. Chúng tôi hoàn toàn không chịu trách nhiệm về các hậu quả liên quan, tranh chấp hay bất kỳ quyết định cá nhân nào phát sinh từ việc sử dụng các thông tin và tỷ lệ do máy tính cung cấp. Tình yêu và mối quan hệ bền vững luôn được quyết định bởi sự thấu hiểu, tôn trọng và nỗ lực thực tế từ hai phía.'
            : 'All calculations and metrics are provided strictly for informational reference and entertainment purposes. We expressly disclaim any responsibility or liability for any decisions, interpersonal disputes, or related consequences arising from the use of this tool.'}
        </p>
      </div>
    </div>
  );
};
export default LoveCalculator;
