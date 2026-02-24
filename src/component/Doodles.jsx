import React from 'react';

// Animated paper plane doodle
export const MailPlaneDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 120 120" className={`w-28 h-28 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Flight path dotted line */}
    <path d="M10 80 Q 40 40, 70 85 T 110 30" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="6 6" className="animate-sketch" />
    {/* Paper plane body */}
    <g className="animate-float">
      <path d="M90 20 L110 30 L85 45 L65 35 Z" fill="rgba(99, 102, 241, 0.1)" stroke="rgb(129, 140, 248)" />
      <path d="M85 45 L95 55 L90 20" fill="rgba(99, 102, 241, 0.2)" stroke="rgb(129, 140, 248)" />
      <path d="M65 35 L110 30 L85 45" stroke="rgb(129, 140, 248)" />
    </g>
  </svg>
);

// Eye tracker scanner doodle
export const EyeScannerDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={`w-24 h-24 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer eye lids */}
    <path d="M15 50 Q50 20 85 50" stroke="rgb(168, 85, 247)" className="animate-sketch" />
    <path d="M15 50 Q50 80 85 50" stroke="rgb(168, 85, 247)" className="animate-sketch" />
    {/* Pupil/Iris */}
    <circle cx="50" cy="50" r="15" fill="rgba(168, 85, 247, 0.1)" stroke="rgb(139, 92, 246)" />
    <circle cx="50" cy="50" r="6" fill="rgb(139, 92, 246)" />
    {/* Lashes */}
    <path d="M30 30 L25 20 M50 24 L50 12 M70 30 L75 20" stroke="rgb(168, 85, 247)" />
    {/* Radar scanning line */}
    <line x1="20" y1="50" x2="80" y2="50" stroke="rgb(34, 211, 238)" strokeWidth="2.5" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
  </svg>
);

// Notion-style stars doodle
export const SparkleDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={`w-16 h-16 ${className} animate-float`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    {/* Sparkle 1 */}
    <path d="M50 15 C50 35 35 50 15 50 C35 50 50 65 50 85 C50 65 65 50 85 50 C65 50 50 35 50 15 Z" fill="rgba(245, 158, 11, 0.15)" stroke="rgb(245, 158, 11)" className="animate-sketch" />
    {/* Sparkle 2 (small) */}
    <path d="M80 20 C80 26 76 30 70 30 C76 30 80 34 80 40 C80 34 84 30 90 30 C84 30 80 26 80 20 Z" fill="rgba(251, 191, 36, 0.2)" stroke="rgb(251, 191, 36)" />
  </svg>
);

// Hand-drawn sketch curly highlight for text
export const HighlightDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 200 60" className={`absolute -bottom-2.5 -left-1 w-[calc(100%+8px)] h-8 pointer-events-none ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 45 Q 60 55, 115 45 T 195 40 M 15 50 Q 80 58, 185 45" stroke="rgb(244, 63, 94)" strokeWidth="3" className="animate-sketch" style={{ animationDelay: '0.4s' }} />
  </svg>
);

// Lock & Key security doodle
export const LockKeyDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={`w-20 h-20 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Shackle */}
    <path d="M32 45 V32 A18 18 0 0 1 68 32 V45" stroke="rgb(236, 72, 153)" />
    {/* Padlock Body */}
    <rect x="25" y="45" width="50" height="40" rx="10" fill="rgba(236, 72, 153, 0.1)" stroke="rgb(236, 72, 153)" />
    {/* Keyhole */}
    <circle cx="50" cy="60" r="5" fill="rgb(236, 72, 153)" />
    <path d="M50 65 V73" stroke="rgb(236, 72, 153)" strokeWidth="3" />
  </svg>
);

// Empty state magnifying search doodle
export const EmptyDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 160 160" className={`w-40 h-40 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Envelope */}
    <rect x="25" y="45" width="110" height="70" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.2)" />
    <path d="M25 45 L80 85 L135 45" stroke="rgba(255, 255, 255, 0.2)" />
    {/* Dotted tracking beam */}
    <line x1="80" y1="85" x2="115" y2="115" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
    {/* Magnifying Glass */}
    <g className="animate-float" style={{ animationDuration: '3s' }}>
      <circle cx="115" cy="115" r="18" fill="rgba(59, 130, 246, 0.15)" stroke="rgb(59, 130, 246)" strokeWidth="2.5" />
      <line x1="128" y1="128" x2="148" y2="148" stroke="rgb(59, 130, 246)" strokeWidth="3.5" />
      {/* Star highlights */}
      <path d="M70 15 L72 20 L77 22 L72 24 L70 29 L68 24 L63 22 L68 20 Z" fill="rgba(245, 158, 11, 0.8)" stroke="none" />
    </g>
  </svg>
);
