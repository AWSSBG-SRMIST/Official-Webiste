'use client'

import React from 'react';
import Image from 'next/image';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <div className="loader-logo-wrap">
          <Image
            src="/logo.png"
            alt="AWS Cloud Clubs SRMIST"
            width={120}
            height={120}
            priority
            className="loader-logo"
          />
        </div>
        <p className="loader-text">AWS Cloud Clubs - SRMIST</p>
      </div>
    </div>
  );
};

export default Loader;
