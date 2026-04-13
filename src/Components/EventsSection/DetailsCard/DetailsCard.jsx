'use client'

import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import './DetailsCard.css';

const DetailsCard = ({ title, date, venue, speaker, description, link }) => {
  return (
    <div className="details-card">
      <h3 className="details-title">{title}</h3>
      <div className="details-meta">
        {date && (
          <span className="details-meta-item">
            <FaCalendarAlt /> {date}
          </span>
        )}
        {venue && (
          <span className="details-meta-item">
            <FaMapMarkerAlt /> {venue}
          </span>
        )}
        {speaker && (
          <span className="details-meta-item">
            <FaUser /> {speaker}
          </span>
        )}
      </div>
      {description && <p className="details-desc">{description}</p>}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="details-btn">
          View Details
        </a>
      )}
    </div>
  );
};

export default DetailsCard;
