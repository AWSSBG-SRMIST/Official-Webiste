'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import { fetchYearFolders, fetchAllEventFolders, fetchFiles, getDownloadUrl } from './driveApi';
import './CertificatesSection.css';

const CertificatesSection = () => {
  const [yearFolders, setYearFolders] = useState([]);
  const [eventFolders, setEventFolders] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const years = await fetchYearFolders();
      setYearFolders(years);
      const events = await fetchAllEventFolders(years);
      setEventFolders(events);
    } catch (err) {
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visibleEvents = useMemo(() => {
    if (selectedYear === 'All') return eventFolders;
    return eventFolders.filter((ev) => ev.year === selectedYear);
  }, [eventFolders, selectedYear]);

  const handleFolderClick = async (folder) => {
    if (expandedFolder === folder.id) {
      setExpandedFolder(null);
      return;
    }
    setExpandedFolder(folder.id);
    if (folderFiles[folder.id]) return;
    setLoadingFiles(folder.id);
    try {
      const files = await fetchFiles(folder.id);
      setFolderFiles((prev) => ({ ...prev, [folder.id]: files }));
    } catch {
      setFolderFiles((prev) => ({ ...prev, [folder.id]: [] }));
    } finally {
      setLoadingFiles(null);
    }
  };

  const handleDownload = (fileId) => {
    window.open(getDownloadUrl(fileId), '_blank', 'noopener,noreferrer');
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (eventFolders.length === 0) return <EmptyState />;

  return (
    <section className="certs-section">
      <div className="certs-container">
        <SectionHeader
          title="Certificates"
          subtitle="Download your certificate from any AWS Cloud Club event"
        />

        {/* Search */}
        <div className="certs-search-wrap">
          <span className="certs-search-icon">⌕</span>
          <input
            className="certs-search"
            type="text"
            placeholder="Search by name — e.g. Your Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="certs-search-clear" aria-label="Clear search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Year Filter */}
        <div className="certs-year-tabs">
          {['All', ...yearFolders.map((y) => y.name)].map((yr) => (
            <button
              key={yr}
              className={`certs-year-tab ${selectedYear === yr ? 'active' : ''}`}
              onClick={() => setSelectedYear(yr)}
            >
              {yr === 'All' ? 'All Years' : yr}
            </button>
          ))}
        </div>

        {/* Event Folder Grid */}
        <div className="certs-grid">
          {visibleEvents.map((folder) => {
            const isExpanded = expandedFolder === folder.id;
            const files = folderFiles[folder.id] || [];
            const isFetchingFiles = loadingFiles === folder.id;

            return (
              <div
                key={folder.id}
                role="button"
                tabIndex={0}
                className={`certs-folder-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleFolderClick(folder)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFolderClick(folder)}
                aria-expanded={isExpanded}
              >
                <div className="certs-folder-header">
                  <span className="certs-folder-icon">{isExpanded ? '📂' : '📁'}</span>
                  <div className="certs-folder-meta">
                    <span className="certs-folder-name">{folder.name}</span>
                    <span className="certs-folder-year">{folder.year}</span>
                  </div>
                  <span className="certs-folder-chevron">{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div className="certs-file-list" onClick={(e) => e.stopPropagation()}>
                    {isFetchingFiles && (
                      <div className="certs-files-loading">
                        <div className="certs-spinner-sm" />
                        <span>Loading certificates...</span>
                      </div>
                    )}
                    {!isFetchingFiles && files.length === 0 && (
                      <p className="certs-files-empty">No certificates in this folder.</p>
                    )}
                    {!isFetchingFiles && files.map((file) => {
                      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                      const query = searchQuery.trim().toLowerCase();
                      const dimmed = query && !nameWithoutExt.toLowerCase().includes(query);
                      return (
                        <div key={file.id} className={`certs-file-row ${dimmed ? 'dimmed' : ''}`}>
                          <span className="certs-file-icon">📄</span>
                          <span className="certs-file-name">{nameWithoutExt}</span>
                          <button
                            className="certs-download-btn"
                            onClick={() => handleDownload(file.id)}
                          >
                            ⬇ Download
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const LoadingState = () => (
  <section className="certs-section">
    <div className="certs-container">
      <div className="certs-status-wrap">
        <div className="certs-spinner" />
        <p className="certs-status-text">Fetching certificates...</p>
      </div>
    </div>
  </section>
);

const ErrorState = ({ message, onRetry }) => (
  <section className="certs-section">
    <div className="certs-container">
      <div className="certs-status-wrap">
        <p className="certs-status-text error">{message}</p>
        <button className="certs-retry-btn" onClick={onRetry}>Try Again</button>
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="certs-section">
    <div className="certs-container">
      <SectionHeader title="Certificates" subtitle="Download your certificate from any AWS Cloud Club event" />
      <div className="certs-empty">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
          <rect x="12" y="16" width="56" height="48" rx="6" fill="rgba(184,54,254,0.1)" stroke="#B836FE" strokeWidth="1.5"/>
          <path d="M24 36h32M24 44h20" stroke="#FA46F2" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="58" cy="56" r="10" fill="rgba(184,54,254,0.15)" stroke="#B836FE" strokeWidth="1.2"/>
          <path d="M54 56l3 3 5-5" stroke="#FA46F2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="certs-empty-text">No certificates yet.</p>
        <p className="certs-empty-sub">Check back after our next event!</p>
      </div>
    </div>
  </section>
);

export default CertificatesSection;
