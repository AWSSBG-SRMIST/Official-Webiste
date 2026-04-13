'use client'

import React from 'react';
import './BlurCard.css';

const BlurCard = ({ children, className = '' }) => {
  return (
    <div className={`blur-card ${className}`}>
      {children}
    </div>
  );
};

export default BlurCard;
