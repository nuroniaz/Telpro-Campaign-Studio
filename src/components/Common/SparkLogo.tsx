import React from 'react';

interface SparkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'auto';
  showSubtitles?: boolean;
  className?: string;
  center?: boolean;
}

/**
 * Official SVG Mark matching "icon SPARK.svg"
 * Sleek aerodynamic emblem with vibrant scarlet wing, golden orange-to-yellow canopy,
 * metallic slate ventral fin, and sweeping white dividing ribbons.
 */
export const SparkLogoMark: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-10 h-10",
  size
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;
  
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      style={style}
    >
      <defs>
        {/* Left Red Wing Gradient: Vibrant Scarlet Red to Warm Red-Orange */}
        <linearGradient id="sparkMarkFireRed" x1="40" y1="360" x2="560" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DF0820" />
          <stop offset="30%" stopColor="#E71327" />
          <stop offset="70%" stopColor="#F32A15" />
          <stop offset="100%" stopColor="#FA4A0E" />
        </linearGradient>

        {/* Top-Right Wing Gradient: Deep Orange to Bright Golden Yellow */}
        <linearGradient id="sparkMarkOrange" x1="580" y1="560" x2="975" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FA4400" />
          <stop offset="30%" stopColor="#FF6600" />
          <stop offset="65%" stopColor="#FFA200" />
          <stop offset="100%" stopColor="#FFC800" />
        </linearGradient>

        {/* Bottom Ventral Fin Gradient: Medium Slate Grey to Dark Charcoal Grey */}
        <linearGradient id="sparkMarkVentralFin" x1="300" y1="640" x2="580" y2="980" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B9197" />
          <stop offset="45%" stopColor="#6B7177" />
          <stop offset="100%" stopColor="#474D53" />
        </linearGradient>
      </defs>

      {/* 1. Bottom Ventral Fin (Metallic Slate Grey) */}
      <path
        id="sparkFin"
        d="M 298 638
           C 365 605, 475 528, 575 422
           C 608 468, 648 518, 692 578
           C 670 660, 640 762, 595 868
           C 572 922, 552 966, 542 976
           C 538 978, 532 972, 526 952
           C 485 836, 452 760, 400 704
           C 356 658, 314 644, 298 638 Z"
        fill="url(#sparkMarkVentralFin)"
      />

      {/* 2. Top-Right Orange/Yellow Main Body (Inner Triangle) */}
      <path
        id="sparkOrangeInner"
        d="M 578 416
           C 584 328, 578 230, 554 138
           C 610 118, 668 98, 725 76
           C 756 182, 736 292, 676 366
           C 636 410, 598 418, 578 416 Z"
        fill="url(#sparkMarkOrange)"
      />

      {/* 3. Top-Right Orange/Yellow Outer Wingtip & Crescent */}
      <path
        id="sparkOrangeOuter"
        d="M 730 74
           C 785 60, 870 40, 972 26
           C 978 32, 962 68, 932 138
           C 876 270, 800 422, 692 578
           C 688 568, 685 538, 692 498
           C 740 368, 796 238, 756 124
           C 746 96, 738 82, 730 74 Z"
        fill="url(#sparkMarkOrange)"
      />

      {/* 4. Left Red Wing (Main Body + Lower Lobe) */}
      <path
        id="sparkRedWing"
        d="M 26 370
           C 24 356, 38 342, 60 326
           C 145 262, 296 178, 456 126
           C 498 112, 532 118, 545 133
           C 568 214, 578 308, 578 416
           C 525 454, 470 494, 416 532
           C 410 536, 405 533, 407 518
           C 416 464, 408 424, 360 394
           C 285 348, 160 358, 48 382
           C 32 386, 26 380, 26 370 Z"
        fill="url(#sparkMarkFireRed)"
      />

      {/* 5. Sweeping White Slicing Crescent across Red Wing and into Orange Wing */}
      <path
        id="sparkRibbon1"
        d="M 188 358
           C 265 340, 375 344, 480 370
           C 540 386, 570 404, 578 416
           C 646 368, 722 278, 756 124
           C 750 144, 715 258, 646 348
           C 585 428, 520 424, 430 396
           C 330 366, 240 364, 188 358 Z"
        fill="#FFFFFF"
      />

      {/* 6. Dividing White Channel between Red, Orange and Grey */}
      <path
        id="sparkRibbon2"
        d="M 545 133
           C 562 128, 570 138, 575 158
           C 585 238, 592 328, 578 416
           C 525 458, 420 538, 298 638
           C 318 632, 434 528, 514 448
           C 560 404, 565 318, 555 238
           C 550 188, 546 148, 545 133 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

/**
 * Custom SPARK Wordmark matching "Logo SPARK new.png"
 * - "S": Red-to-Orange gradient
 * - "P": Solid charcoal / white
 * - "A": Custom chevron with bright fiery orange triangle accent in center
 * - "R": Solid charcoal / white
 * - "K": Solid charcoal / white
 */
export const SparkWordmark: React.FC<{
  isDark?: boolean;
  sizeClass?: string;
}> = ({ isDark = false, sizeClass = "text-2xl sm:text-3xl" }) => {
  const textColor = isDark ? "text-slate-100" : "text-[#23272F]";

  return (
    <div className={`font-black tracking-tight flex items-center font-sans select-none leading-none ${sizeClass}`}>
      <svg className="w-0 h-0 absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="sparkTextFireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="sparkTriangleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="60%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>

      {/* S - Stylized Red-to-Orange Gradient */}
      <span 
        className="font-black pr-0.5 inline-block"
        style={{
          background: 'linear-gradient(180deg, #DC2626 0%, #EA580C 52%, #F97316 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}
      >
        S
      </span>

      {/* P - Bold Charcoal */}
      <span className={`font-black tracking-tight ${textColor}`}>
        P
      </span>

      {/* A - Custom Chevron with Fiery Center Triangle */}
      <span className="relative inline-flex items-center justify-center mx-[0.04em]">
        <span className={`font-black tracking-tight ${textColor} opacity-0 pointer-events-none select-none`}>
          A
        </span>
        {/* High precision SVG 'A' glyph */}
        <svg 
          viewBox="0 0 68 76" 
          className="absolute inset-0 w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer chevron legs */}
          <path
            d="M 6 74 L 34 8 L 62 74 L 46 74 L 34 45 L 22 74 Z"
            fill={isDark ? "#F8FAFC" : "#23272F"}
          />
          {/* Floating Inner Fiery Orange Triangle Accent */}
          <polygon
            points="34,26 21,56 47,56"
            fill="url(#sparkTriangleGrad)"
          />
        </svg>
      </span>

      {/* R - Bold Charcoal */}
      <span className={`font-black tracking-tight ${textColor}`}>
        R
      </span>

      {/* K - Bold Charcoal */}
      <span className={`font-black tracking-tight ${textColor}`}>
        K
      </span>
    </div>
  );
};

export const SparkLogo: React.FC<SparkLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitles = true,
  className = '',
  center = false
}) => {
  const isDark = variant === 'dark';

  // Sizing maps
  const markSizeMap = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-11 sm:h-11',
    lg: 'w-13 h-13 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24'
  };

  const titleTextSizeMap = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-5xl sm:text-6xl'
  };

  const acronymTextSizeMap = {
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[10px] sm:text-[11.5px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base'
  };

  const taglineTextSizeMap = {
    sm: 'text-[8px] sm:text-[9px]',
    md: 'text-[8.5px] sm:text-[10px]',
    lg: 'text-[10px] sm:text-xs',
    xl: 'text-xs sm:text-sm'
  };

  return (
    <div className={`flex ${center ? 'flex-col items-center text-center' : 'items-center'} gap-3.5 select-none ${className}`}>
      {/* Icon Mark */}
      <SparkLogoMark className={markSizeMap[size]} />

      {/* Text Group */}
      <div className={`flex flex-col justify-center ${center ? 'items-center' : 'items-start'}`}>
        {/* Main "SPARK" Wordmark */}
        <SparkWordmark isDark={isDark} sizeClass={titleTextSizeMap[size]} />

        {/* Subtitle & Acronym Lines */}
        {showSubtitles && (
          <div className={`mt-1 sm:mt-1.5 space-y-0.5 ${center ? 'text-center' : 'text-left'}`}>
            {/* Line 1: Strategy, Production, Approval, Repository & Knowledge */}
            <div className={`font-semibold tracking-normal whitespace-nowrap leading-tight ${acronymTextSizeMap[size]} ${isDark ? 'text-slate-200' : 'text-[#1E293B]'}`}>
              <span className="text-[#DC2626] font-black">S</span>trategy,&nbsp;
              <span className="text-[#EA580C] font-black">P</span>roduction,&nbsp;
              <span className="text-[#F97316] font-black">A</span>pproval,&nbsp;
              <span className="text-[#EA580C] font-black">R</span>epository &amp;&nbsp;
              <span className="text-[#F97316] font-black">K</span>nowledge
            </div>

            {/* Line 2: Integrated Content Workflow, Governance & Knowledge Platform */}
            <div className={`font-medium tracking-tight whitespace-nowrap leading-tight ${taglineTextSizeMap[size]} ${isDark ? 'text-slate-400' : 'text-[#475569]'}`}>
              Integrated Content Workflow, Governance &amp; Knowledge Platform
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
