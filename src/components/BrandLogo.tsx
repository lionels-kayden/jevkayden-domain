"use client";

import React, { useId } from "react";

export type BrandLogoVariant = "hub" | "ieee" | "admin";

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: number | string;
  className?: string;
  showBorder?: boolean;
  title?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "hub",
  size = 32,
  className = "",
  showBorder = true,
  title,
}) => {
  const rawId = useId();
  const gradId = `brand-ieee-grad-${rawId.replace(/[:]/g, "")}`;

  // Continuous vector geometry: Design 04 (Infinity Ribbon JK Loop)
  const ribbonPath =
    "M29 14 V41 C29 47.5 23.5 50.5 18 50.5 C13 50.5 11 46 12.5 41 C14 36 20.5 34.5 29 33.5 L48 15 L33.5 30.5 L49 49.5";
  const stemPath =
    "M29 14 V41 C29 47.5 23.5 50.5 18 50.5 C13 50.5 11 46 12.5 41";

  // Visual Theme Configuration per variant
  const theme = {
    hub: {
      bgFill: "#111111",
      borderColor: "#000000",
      frameColor: "#FACC15",
      frameOpacity: 0.8,
      frameDash: undefined,
      ribbonColor: "#FACC15",
      stemColor: "#FFFFFF",
      cornerDotColor: "#FACC15",
    },
    ieee: {
      bgFill: `url(#${gradId})`,
      borderColor: "#002855",
      frameColor: "#7DD3FC",
      frameOpacity: 0.85,
      frameDash: undefined,
      ribbonColor: "#7DD3FC",
      stemColor: "#FFFFFF",
      cornerDotColor: "#7DD3FC",
    },
    admin: {
      bgFill: "#090D16",
      borderColor: "#F59E0B",
      frameColor: "#F59E0B",
      frameOpacity: 0.75,
      frameDash: "3 2",
      ribbonColor: "#F59E0B",
      stemColor: "#FFFFFF",
      cornerDotColor: "#F59E0B",
    },
  }[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
      role="img"
      aria-label={title || `Jev Kayden Brand Logo (${variant.toUpperCase()})`}
    >
      <defs>
        {variant === "ieee" && (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00629B" />
            <stop offset="100%" stopColor="#002855" />
          </linearGradient>
        )}
      </defs>

      {/* 1. Outer Package / Chip Background */}
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="4"
        fill={theme.bgFill}
        stroke={showBorder ? theme.borderColor : "none"}
        strokeWidth={showBorder ? 3 : 0}
      />

      {/* 2. Inner Technical Frame & Alignment Micro-Dots */}
      <rect
        x="5.5"
        y="5.5"
        width="53"
        height="53"
        rx="2"
        fill="none"
        stroke={theme.frameColor}
        strokeWidth="1.2"
        strokeOpacity={theme.frameOpacity}
        strokeDasharray={theme.frameDash}
      />
      <circle cx="9" cy="9" r="1.2" fill={theme.cornerDotColor} />
      <circle cx="55" cy="9" r="1.2" fill={theme.cornerDotColor} />
      <circle cx="9" cy="55" r="1.2" fill={theme.cornerDotColor} />
      <circle cx="55" cy="55" r="1.2" fill={theme.cornerDotColor} />

      {/* 3. Design 04: Continuous K-Ribbon Loop */}
      <path
        d={ribbonPath}
        fill="none"
        stroke={theme.ribbonColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Pure White J-Stem Overlay */}
      <path
        d={stemPath}
        fill="none"
        stroke={theme.stemColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

