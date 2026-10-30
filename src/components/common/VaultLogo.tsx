import React from 'react';

interface VaultLogoProps {
  className?: string;
  size?: number;
}

/**
 * NotebookLM-inspired geometric Vault Logo.
 * Features an elegant, modern aperture vault geometry
 * with subtle periwinkle-to-violet gradients.
 */
export const VaultLogo: React.FC<VaultLogoProps> = ({ className = 'w-7 h-7', size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="vaultGrad1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="vaultGrad2" x1="28" y1="4" x2="4" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Rounded Outer Chamber */}
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="8"
        stroke="url(#vaultGrad1)"
        strokeWidth="2.2"
        fill="currentColor"
        fillOpacity="0.06"
      />

      {/* Central Aperture Segments (NotebookLM / Vault Aesthetic) */}
      <circle
        cx="16"
        cy="16"
        r="6.5"
        stroke="url(#vaultGrad2)"
        strokeWidth="2"
        strokeDasharray="28 4"
      />

      {/* Dynamic Vault Iris Spokes */}
      <path
        d="M16 6.5V11M16 21V25.5M6.5 16H11M21 16H25.5"
        stroke="url(#vaultGrad1)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Core Node */}
      <circle cx="16" cy="16" r="2.2" fill="url(#vaultGrad2)" />
    </svg>
  );
};
