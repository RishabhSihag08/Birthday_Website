import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const SparkleIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 0C12.5 6 18 11.5 24 12C18 12.5 12.5 18 12 24C11.5 18 6 12.5 0 12C6 11.5 11.5 6 12 0Z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const HeartOutlineIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const CakeEmblemIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v3" />
    <path d="M12 8v3" />
    <path d="M17 8v3" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const EnvelopeOpenIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l9.2-6.4 9.2 6.4z" />
    <polyline points="22 10 12 17 2 10" />
    <path d="M2 20l7-6" />
    <path d="M22 20l-7-6" />
  </svg>
);

export const WaxSealIcon: React.FC<IconProps> = ({ className = "w-8 h-8", size, ...props }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Irregular scalloped wax seal perimeter */}
    <path
      d="M20 2C24.5 2 27.5 4.5 31.5 5.5C35.5 6.5 38 9.5 38.5 13.5C39 17.5 37 21 37.5 25.5C38 30 35.5 33.5 31.5 35.5C27.5 37.5 24 36.5 20 38C16 36.5 12.5 37.5 8.5 35.5C4.5 33.5 2 30 2.5 25.5C3 21 1 17.5 1.5 13.5C2 9.5 4.5 6.5 8.5 5.5C12.5 4.5 15.5 2 20 2Z"
      fill="currentColor"
    />
    <circle cx="20" cy="20" r="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
    {/* Inner Monogram / Heart */}
    <path
      d="M20 25.5l-1.15-1.05C14.75 20.75 12 18.3 12 15.3c0-2.45 1.95-4.3 4.4-4.3 1.4 0 2.7.65 3.6 1.7.9-1.05 2.2-1.7 3.6-1.7 2.45 0 4.4 1.85 4.4 4.3 0 3-2.75 5.45-6.85 9.15L20 25.5z"
      fill="rgba(255, 255, 255, 0.85)"
    />
  </svg>
);

export const ScrollArrowIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export const SoundOnIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const SoundOffIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export const PetalIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C7 6 4 12 6 18c2 6 8 4 12 1 4-3 5-9 1-13-2-2-5-4-7-4z" />
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2c-.6 2.3-2 4.1-3.5 5.8-2 2.3-3.5 4.8-3.5 7.8 0 4.4 3.6 8 8 8s8-3.6 8-8c0-2.8-1.4-5.3-3.2-7.5-1.5-1.8-2.8-3.8-3.3-6.1-.2-.8-1.3-1.6-2.5 0zm.2 16.5c-2.1 0-3.7-1.6-3.7-3.7 0-1.5 1-2.9 2-3.8.4-.4 1-.2 1.2.3.5 1.1 1.2 1.8 1.9 2.5.5.6.8 1.4.8 2.2 0 1.4-1 2.5-2.2 2.5z" />
  </svg>
);

export const FloralVineIcon: React.FC<IconProps> = ({ className = "w-24 h-6", size, ...props }) => (
  <svg
    viewBox="0 0 120 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10 12 Q 35 2 60 12 T 110 12" />
    <path d="M35 8 C 30 5, 26 10, 35 8" fill="currentColor" opacity="0.6" />
    <path d="M50 14 C 55 18, 59 13, 50 14" fill="currentColor" opacity="0.6" />
    <path d="M75 9 C 72 4, 68 8, 75 9" fill="currentColor" opacity="0.6" />
    <path d="M90 14 C 95 19, 100 15, 90 14" fill="currentColor" opacity="0.6" />
    <circle cx="60" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const ReplayIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

export const FeatherQuillIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);
