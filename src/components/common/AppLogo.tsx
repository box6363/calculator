import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  useImage?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  className = "w-9 h-9", 
  size,
  useImage = true 
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  if (useImage) {
    return (
      <img
        src="/app-logo.png"
        alt="Calculator Logo"
        className={`object-contain select-none ${className}`}
        style={{
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          ...style
        }}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-300 ${className}`}
      style={style}
    >
      <defs>
        {/* Soft 3D drop shadow for tiles */}
        <filter id="tileShadow" x="-10%" y="-10%" width="125%" height="135%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.16" />
        </filter>

        {/* 3D Emboss shadow for white math symbols */}
        <filter id="symbol3d" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1.6" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.22" />
        </filter>

        {/* Quadrant 1: Vibrant Green Gradient */}
        <linearGradient id="greenGrad" x1="10" y1="4" x2="38" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="60%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id="greenLight" cx="16" cy="14" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </radialGradient>

        {/* Quadrant 2: Warm Vibrant Red Gradient */}
        <linearGradient id="redGrad" x1="58" y1="4" x2="88" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="60%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <radialGradient id="redLight" cx="64" cy="14" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>

        {/* Quadrant 3: Sunny Warm Amber/Yellow Gradient */}
        <linearGradient id="yellowGrad" x1="10" y1="52" x2="38" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="yellowLight" cx="16" cy="62" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>

        {/* Quadrant 4: Royal Friendly Blue Gradient */}
        <linearGradient id="blueGrad" x1="58" y1="52" x2="88" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="60%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <radialGradient id="blueLight" cx="64" cy="62" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* --- TOP-LEFT: GREEN TILE (+) --- */}
      <g filter="url(#tileShadow)">
        <path
          d="M 24,4 L 41,4 A 7,7 0 0,1 48,11 L 48,41 A 7,7 0 0,1 41,48 L 11,48 A 7,7 0 0,1 4,41 L 4,24 A 20,20 0 0,1 24,4 Z"
          fill="url(#greenGrad)"
        />
        <path
          d="M 24,4 L 41,4 A 7,7 0 0,1 48,11 L 48,41 A 7,7 0 0,1 41,48 L 11,48 A 7,7 0 0,1 4,41 L 4,24 A 20,20 0 0,1 24,4 Z"
          fill="url(#greenLight)"
        />
      </g>
      {/* Plus (+) Symbol */}
      <g filter="url(#symbol3d)">
        <rect x="15" y="22.5" width="22" height="7" rx="3.5" fill="#FFFFFF" />
        <rect x="22.5" y="15" width="7" height="22" rx="3.5" fill="#FFFFFF" />
      </g>

      {/* --- TOP-RIGHT: RED TILE (-) --- */}
      <g filter="url(#tileShadow)">
        <path
          d="M 59,4 L 76,4 A 20,20 0 0,1 96,24 L 96,41 A 7,7 0 0,1 89,48 L 59,48 A 7,7 0 0,1 52,41 L 52,11 A 7,7 0 0,1 59,4 Z"
          fill="url(#redGrad)"
        />
        <path
          d="M 59,4 L 76,4 A 20,20 0 0,1 96,24 L 96,41 A 7,7 0 0,1 89,48 L 59,48 A 7,7 0 0,1 52,41 L 52,11 A 7,7 0 0,1 59,4 Z"
          fill="url(#redLight)"
        />
      </g>
      {/* Minus (-) Symbol */}
      <g filter="url(#symbol3d)">
        <rect x="62" y="22.5" width="24" height="7" rx="3.5" fill="#FFFFFF" />
      </g>

      {/* --- BOTTOM-LEFT: YELLOW/AMBER TILE (×) --- */}
      <g filter="url(#tileShadow)">
        <path
          d="M 11,52 L 41,52 A 7,7 0 0,1 48,59 L 48,89 A 7,7 0 0,1 41,96 L 24,96 A 20,20 0 0,1 4,76 L 4,59 A 7,7 0 0,1 11,52 Z"
          fill="url(#yellowGrad)"
        />
        <path
          d="M 11,52 L 41,52 A 7,7 0 0,1 48,59 L 48,89 A 7,7 0 0,1 41,96 L 24,96 A 20,20 0 0,1 4,76 L 4,59 A 7,7 0 0,1 11,52 Z"
          fill="url(#yellowLight)"
        />
      </g>
      {/* Multiply (×) Symbol */}
      <g filter="url(#symbol3d)" transform="rotate(45 26 74)">
        <rect x="15" y="70.5" width="22" height="7" rx="3.5" fill="#FFFFFF" />
        <rect x="22.5" y="63" width="7" height="22" rx="3.5" fill="#FFFFFF" />
      </g>

      {/* --- BOTTOM-RIGHT: BLUE TILE (Sigma ∑) --- */}
      <g filter="url(#tileShadow)">
        <path
          d="M 59,52 L 89,52 A 7,7 0 0,1 96,59 L 96,76 A 20,20 0 0,1 76,96 L 59,96 A 7,7 0 0,1 52,89 L 52,59 A 7,7 0 0,1 59,52 Z"
          fill="url(#blueGrad)"
        />
        <path
          d="M 59,52 L 89,52 A 7,7 0 0,1 96,59 L 96,76 A 20,20 0 0,1 76,96 L 59,96 A 7,7 0 0,1 52,89 L 52,59 A 7,7 0 0,1 59,52 Z"
          fill="url(#blueLight)"
        />
      </g>
      {/* Sigma (∑) Summation Math Symbol */}
      <g filter="url(#symbol3d)">
        <path
          d="M 81,66 L 67.5,66 L 73.5,74 L 67.5,82 L 81,82"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
