'use client'

import React from 'react';

const GradientProfileIcon = ({ size = 80 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B836FE" />
          <stop offset="100%" stopColor="#6B00A8" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="30" r="18" fill="url(#profileGrad)" opacity="0.8" />
      <ellipse cx="40" cy="68" rx="26" ry="16" fill="url(#profileGrad)" opacity="0.6" />
    </svg>
  );
};

export default GradientProfileIcon;
