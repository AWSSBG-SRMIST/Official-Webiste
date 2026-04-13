'use client'

import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import SectionHeader from '../SectionHeader/SectionHeader';
import 'react-image-gallery/styles/image-gallery.css';
import './GallerySection.css';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      // Firebase not configured yet — show empty state immediately
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            original: data.url,
            thumbnail: data.thumbnailUrl || data.url,
            description: data.caption || '',
            originalTitle: data.eventName || '',
          };
        });
        setImages(imgs);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <SectionHeader
          title="Moments"
          subtitle="Memories from our events and workshops"
        />

        {loading && (
          <div className="gallery-loading">
            <div className="gallery-spinner"></div>
            <p className="gallery-loading-text">Loading moments...</p>
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                <rect x="8" y="20" width="64" height="46" rx="8" fill="rgba(184,54,254,0.1)" stroke="#B836FE" strokeWidth="1.5" />
                <circle cx="26" cy="36" r="6" fill="rgba(184,54,254,0.2)" stroke="#FA46F2" strokeWidth="1.2" />
                <path d="M8 54 L24 40 L36 52 L52 36 L72 54" stroke="#B836FE" strokeWidth="1.5" strokeLinejoin="round" fill="none" strokeDasharray="3 3" />
              </svg>
            </div>
            <p className="gallery-empty-text">No moments here yet.</p>
            <p className="gallery-empty-sub">Check back after our next event!</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="gallery-viewer">
            <ImageGallery
              items={images}
              thumbnailPosition={window.innerWidth >= 768 ? 'right' : 'bottom'}
              showPlayButton={true}
              showFullscreenButton={true}
              showBullets={false}
              showNav={true}
              lazyLoad={true}
              slideInterval={4000}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
