'use client';

import React from 'react';
import Link from 'next/link';
import './EventCard.css';

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CameraIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EventCard = ({ id, title, date, coverImageId, highlights, photoCount }) => {
  const coverSrc = coverImageId
    ? `https://drive.google.com/thumbnail?id=${coverImageId}&sz=w600`
    : null;

  return (
    <div className="event-card">
      {/* Image */}
      <div className="event-card-img-wrap">
        {coverSrc && (
          <img
            src={coverSrc}
            alt={title}
            className="event-card-img"
            loading="lazy"
          />
        )}
        <div className="event-card-img-overlay" />

        {/* Date badge — bottom-left */}
        <div className="event-card-date-badge">
          <CalendarIcon />
          <span>{date}</span>
        </div>

        {/* Photo count — top-right */}
        {photoCount !== null && photoCount !== undefined && (
          <div className="event-card-count-badge">
            <CameraIcon />
            <span>{photoCount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="event-card-body">
        <h3 className="event-card-title">{title}</h3>

        {highlights && highlights.length > 0 && (
          <ul className="event-card-highlights">
            {highlights.slice(0, 3).map((item, i) => (
              <li key={i} className="event-card-highlight-item">
                <span className="event-card-bullet">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <Link href={`/events/${id}`} className="event-card-gallery-link">
          View Gallery
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
