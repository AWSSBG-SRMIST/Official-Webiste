'use client'

import React, { useState, useRef, useEffect } from 'react';
import CountUp from 'react-countup';
import './StatsCard.css';

const StatsCard = ({ end, suffix = '+', label, icon }) => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-card" ref={ref}>
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-number">
        {started ? (
          <CountUp end={end} duration={2.5} separator="," />
        ) : (
          <span>0</span>
        )}
        <span>{suffix}</span>
      </div>
      <div className="stats-label">{label}</div>
    </div>
  );
};

export default StatsCard;
