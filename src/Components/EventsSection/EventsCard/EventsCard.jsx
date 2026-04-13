'use client'

import React from 'react';
import './EventsCard.css';

const EventsCard = ({ poster, title, link }) => {
  return (
    <div className="events-card">
      <div className="events-poster-wrapper">
        {poster ? (
          <img src={poster} alt={title} className="events-poster" />
        ) : (
          <div className="events-poster-placeholder">
            <span>{title?.[0] || 'E'}</span>
          </div>
        )}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="events-view-btn">
          View Event
        </a>
      )}
    </div>
  );
};

export default EventsCard;
