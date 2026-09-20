import React from 'react';
import { Sprout } from 'lucide-react';

interface BrandLogoProps {
  appName?: string;
  appTagline?: string;
  badgeText?: string;
  layout?: 'horizontal' | 'vertical';
  theme?: 'light' | 'dark' | 'card' | 'navbar';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  appName = 'Kisan Setu',
  appTagline = 'Farmer Market & Logistics Platform',
  badgeText = 'Krishi Setu',
  layout = 'horizontal',
  theme = 'light',
  size = 'md',
  onClick,
  className = '',
}) => {
  const isClickable = !!onClick;

  // Icon sizing
  const iconBoxSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4 stroke-[2.2]',
    md: 'w-6 h-6 stroke-[2.2]',
    lg: 'w-8 h-8 stroke-[2.2]',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[10px] sm:text-[11px]',
    md: 'text-[11px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
  };

  // Theming colors
  const isDark = theme === 'dark';
  const isCard = theme === 'card';

  // Container styling for 'card' theme to guarantee branding elements stay enclosed
  const containerThemeClass = isCard
    ? 'bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs'
    : '';

  if (layout === 'vertical') {
    return (
      <div
        id="kisan-setu-brand-container"
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${containerThemeClass} ${
          isClickable ? 'cursor-pointer hover:opacity-95 transition' : ''
        } ${className}`}
      >
        {/* Logo Icon Container */}
        <div
          id="kisan-setu-logo-icon"
          className={`${iconBoxSizes[size]} bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-md mb-2.5 shrink-0`}
        >
          <Sprout className={iconSizes[size]} />
        </div>

        {/* Brand Name & Badge */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1 max-w-full">
          <span
            id="kisan-setu-brand-name"
            className={`${titleSizes[size]} font-bold tracking-tight font-serif ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}
          >
            {appName}
          </span>
          {badgeText && (
            <span
              id="kisan-setu-brand-badge"
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 whitespace-nowrap"
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Tagline / Subtitle */}
        {appTagline && (
          <p
            id="kisan-setu-brand-tagline"
            className={`${taglineSizes[size]} font-medium leading-relaxed max-w-md ${
              isDark
                ? 'text-stone-300'
                : isCard
                ? 'text-emerald-800/90 font-semibold'
                : 'text-stone-600'
            }`}
          >
            {appTagline}
          </p>
        )}
      </div>
    );
  }

  // Horizontal layout (e.g., Navbar & Footer)
  return (
    <div
      id="kisan-setu-brand-container"
      onClick={onClick}
      className={`flex items-center gap-3 select-none min-w-0 ${containerThemeClass} ${
        isClickable ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Logo Icon */}
      <div
        id="kisan-setu-logo-icon"
        className={`${iconBoxSizes[size]} bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-[1.02] transition-transform`}
      >
        <Sprout className={iconSizes[size]} />
      </div>

      {/* Brand Text Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            id="kisan-setu-brand-name"
            className={`${titleSizes[size]} font-bold tracking-tight font-serif truncate ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}
          >
            {appName}
          </span>
          {badgeText && (
            <span
              id="kisan-setu-brand-badge"
              className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 whitespace-nowrap"
            >
              {badgeText}
            </span>
          )}
        </div>

        {appTagline && (
          <p
            id="kisan-setu-brand-tagline"
            className={`${taglineSizes[size]} font-medium leading-snug mt-0.5 truncate ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            {appTagline}
          </p>
        )}
      </div>
    </div>
  );
};
