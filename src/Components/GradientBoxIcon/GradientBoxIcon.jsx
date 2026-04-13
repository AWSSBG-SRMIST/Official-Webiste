'use client'

import React from 'react';

const GradientBoxIcon = ({ size = 48, children }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, rgba(184, 54, 254,0.2), rgba(139, 0, 212,0.3))',
        border: '1px solid rgba(184, 54, 254,0.4)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#B836FE',
        fontSize: size * 0.45,
      }}
    >
      {children}
    </div>
  );
};

export default GradientBoxIcon;
