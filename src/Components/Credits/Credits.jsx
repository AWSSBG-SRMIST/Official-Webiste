'use client'

import React from 'react';
import './Credits.css';

const Credits = () => {
  return (
    <div className="credits-wrapper">
      <p className="credits-text">
        Designed &amp; Built by the{' '}
        <a
          href="https://github.com/aws-cloud-club-srm"
          target="_blank"
          rel="noopener noreferrer"
          className="credits-link"
        >
          AWS Cloud Club - SRMIST Tech Team
        </a>
      </p>
    </div>
  );
};

export default Credits;
