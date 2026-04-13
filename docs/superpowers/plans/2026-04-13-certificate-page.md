# Certificate Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/certificates` page that fetches event folders and certificates from Google Drive and lets users filter by year, search by name, and download their certificate.

**Architecture:** Client-side only — Google Drive API v3 called directly from the browser using a public API key. Drive structure is `Root → Year folders → Event folders → Certificate files`. A custom hook handles all API calls; the section component owns UI state (selected year, search query, expanded folder).

**Tech Stack:** Next.js 16 (App Router), React 19, Google Drive API v3, CSS (no extra libraries)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/app/certificates/page.tsx` | Route, metadata, page shell |
| Create | `src/Components/CertificatesSection/useDriveData.js` | All Google Drive API calls |
| Create | `src/Components/CertificatesSection/CertificatesSection.jsx` | UI, state (year filter, search, expand) |
| Create | `src/Components/CertificatesSection/CertificatesSection.css` | All styles for the section |
| Modify | `src/Components/EventsSection/EventsSection.jsx` | Add "Certificates" link button |
| Create | `.env.local` | Drive API key + root folder ID |

---

## Task 1: Environment Variables

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Create `.env.local` in project root**

```env
NEXT_PUBLIC_CERTS_ROOT_FOLDER_ID=your_root_folder_id_here
NEXT_PUBLIC_DRIVE_API_KEY=your_api_key_here
```

> **How to get these:**
> 1. Go to [Google Cloud Console](https://console.cloud.google.com/)
> 2. Create a project → Enable **Google Drive API**
> 3. Go to Credentials → Create API Key → Restrict to **Google Drive API**
> 4. Create a folder in Google Drive called `Certificates`, set sharing to "Anyone with the link → Viewer"
> 5. The folder ID is the last part of its URL: `drive.google.com/drive/folders/THIS_PART`
> 6. Paste both values into `.env.local`

- [ ] **Step 2: Verify env vars load**

Start the dev server and run in browser console:
```js
console.log(process.env.NEXT_PUBLIC_CERTS_ROOT_FOLDER_ID)
```
Expected: your folder ID (not `undefined`)

- [ ] **Step 3: Add `.env.local` to `.gitignore` if not already there**

Check `.gitignore` — it should contain `.env.local`. If not, add it.

---

## Task 2: Google Drive API Hook (`useDriveData.js`)

**Files:**
- Create: `src/Components/CertificatesSection/useDriveData.js`

- [ ] **Step 1: Create the hook file**

```js
// src/Components/CertificatesSection/useDriveData.js

const API_KEY = process.env.NEXT_PUBLIC_DRIVE_API_KEY;
const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_CERTS_ROOT_FOLDER_ID;
const BASE = 'https://www.googleapis.com/drive/v3/files';

/**
 * Fetch immediate child folders of a given folder ID.
 * Returns array of { id, name }
 */
export async function fetchFolders(parentId) {
  const q = encodeURIComponent(
    `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const res = await fetch(`${BASE}?q=${q}&fields=files(id,name)&key=${API_KEY}`);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data = await res.json();
  return data.files || [];
}

/**
 * Fetch all non-folder files inside a folder ID.
 * Returns array of { id, name }
 */
export async function fetchFiles(folderId) {
  const q = encodeURIComponent(
    `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`
  );
  const res = await fetch(`${BASE}?q=${q}&fields=files(id,name)&key=${API_KEY}`);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data = await res.json();
  return data.files || [];
}

/**
 * Returns the direct Google Drive download URL for a file ID.
 */
export function getDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Fetch all year folders from the root Certificates folder.
 * Returns array of { id, name } sorted descending by name (2025, 2024, …)
 */
export async function fetchYearFolders() {
  const folders = await fetchFolders(ROOT_FOLDER_ID);
  return folders.sort((a, b) => b.name.localeCompare(a.name));
}

/**
 * Fetch all event folders across all year folders.
 * Returns array of { id, name, year } sorted descending by year.
 */
export async function fetchAllEventFolders(yearFolders) {
  const results = await Promise.all(
    yearFolders.map(async (yr) => {
      const events = await fetchFolders(yr.id);
      return events.map((ev) => ({ ...ev, year: yr.name }));
    })
  );
  return results.flat();
}
```

- [ ] **Step 2: Manually verify in browser**

In `CertificatesSection.jsx` (Task 3 Step 1), temporarily add to `useEffect`:
```js
import { fetchYearFolders } from './useDriveData';
fetchYearFolders().then(console.log).catch(console.error);
```
Expected: array of year folder objects logged to console. If you see a 403, your API key or folder permissions are wrong.

---

## Task 3: CertificatesSection Component

**Files:**
- Create: `src/Components/CertificatesSection/CertificatesSection.jsx`

- [ ] **Step 1: Create the component skeleton**

```jsx
// src/Components/CertificatesSection/CertificatesSection.jsx
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import { fetchYearFolders, fetchAllEventFolders, fetchFiles, getDownloadUrl } from './useDriveData';
import './CertificatesSection.css';

const CertificatesSection = () => {
  const [yearFolders, setYearFolders] = useState([]);   // [{ id, name }]
  const [eventFolders, setEventFolders] = useState([]); // [{ id, name, year }]
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolder, setExpandedFolder] = useState(null); // folder id or null
  const [folderFiles, setFolderFiles] = useState({});   // { folderId: [{ id, name }] }
  const [loadingFiles, setLoadingFiles] = useState(null); // folderId being loaded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
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
    };
    load();
  }, []);

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
    if (folderFiles[folder.id]) return; // already fetched
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
    window.open(getDownloadUrl(fileId), '_blank');
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
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
            placeholder="Search by name — e.g. Rohit Kumar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="certs-search-clear" onClick={() => setSearchQuery('')}>✕</button>
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
                className={`certs-folder-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleFolderClick(folder)}
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

const ErrorState = ({ message }) => (
  <section className="certs-section">
    <div className="certs-container">
      <div className="certs-status-wrap">
        <p className="certs-status-text" style={{ color: '#f87171' }}>{message}</p>
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
```

- [ ] **Step 2: Verify the component renders without crashing**

Run `npm run dev`, visit `http://localhost:3000/certificates` (you'll get a 404 until Task 5 — that's fine for now).

---

## Task 4: CSS Styles

**Files:**
- Create: `src/Components/CertificatesSection/CertificatesSection.css`

- [ ] **Step 1: Create the stylesheet**

```css
/* src/Components/CertificatesSection/CertificatesSection.css */

.certs-section {
  padding: 80px 24px;
  background: transparent;
  min-height: 60vh;
  position: relative;
  overflow: hidden;
}

.certs-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(184, 54, 254, 0.07);
  border-radius: 50%;
  filter: blur(100px);
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.certs-container {
  max-width: 1100px;
  margin: 0 auto;
}

/* Search */
.certs-search-wrap {
  position: relative;
  max-width: 440px;
  margin: 28px auto 24px;
}

.certs-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #B836FE;
  font-size: 1rem;
  pointer-events: none;
}

.certs-search {
  width: 100%;
  background: rgba(184, 54, 254, 0.07);
  border: 1px solid rgba(184, 54, 254, 0.3);
  border-radius: 8px;
  padding: 10px 40px 10px 38px;
  color: #fff;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.certs-search:focus {
  border-color: #B836FE;
}

.certs-search::placeholder {
  color: #4b5563;
}

.certs-search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px;
  transition: color 0.2s;
}

.certs-search-clear:hover {
  color: #FA46F2;
}

/* Year Tabs */
.certs-year-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.certs-year-tab {
  background: transparent;
  border: 1px solid rgba(184, 54, 254, 0.3);
  border-radius: 20px;
  padding: 6px 20px;
  color: #6b7280;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.certs-year-tab:hover {
  border-color: rgba(184, 54, 254, 0.6);
  color: #d1d5db;
}

.certs-year-tab.active {
  background: rgba(184, 54, 254, 0.2);
  border-color: #B836FE;
  color: #FA46F2;
}

/* Folder Grid */
.certs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.certs-folder-card {
  background: rgba(184, 54, 254, 0.07);
  border: 1px solid rgba(184, 54, 254, 0.22);
  border-radius: 10px;
  padding: 18px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.certs-folder-card:hover {
  border-color: rgba(184, 54, 254, 0.5);
  background: rgba(184, 54, 254, 0.1);
}

.certs-folder-card.expanded {
  border-color: #B836FE;
  background: rgba(184, 54, 254, 0.06);
  grid-column: span 2;
}

.certs-folder-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.certs-folder-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.certs-folder-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.certs-folder-name {
  font-family: 'Share Tech', sans-serif;
  font-size: 0.85rem;
  color: #fff;
}

.certs-folder-year {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  color: #6b7280;
}

.certs-folder-chevron {
  font-size: 0.65rem;
  color: #B836FE;
  flex-shrink: 0;
}

/* File List */
.certs-file-list {
  margin-top: 16px;
  border-top: 1px solid rgba(184, 54, 254, 0.15);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.certs-files-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #6b7280;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.78rem;
}

.certs-files-empty {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: #4b5563;
  margin: 0;
  padding: 8px 0;
}

.certs-file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(184, 54, 254, 0.08);
  border-radius: 6px;
  padding: 8px 12px;
  transition: opacity 0.2s;
}

.certs-file-row.dimmed {
  opacity: 0.3;
}

.certs-file-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.certs-file-name {
  flex: 1;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.78rem;
  color: #d1d5db;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.certs-download-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #B836FE, #FA46F2);
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  color: #fff;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.certs-download-btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

/* Spinner */
.certs-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(184, 54, 254, 0.2);
  border-top-color: #B836FE;
  border-radius: 50%;
  animation: certSpin 0.8s linear infinite;
}

.certs-spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(184, 54, 254, 0.2);
  border-top-color: #B836FE;
  border-radius: 50%;
  animation: certSpin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes certSpin {
  to { transform: rotate(360deg); }
}

.certs-status-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
}

.certs-status-text {
  font-family: 'Share Tech', sans-serif;
  color: #6b7280;
  margin: 0;
}

/* Empty state */
.certs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  gap: 12px;
}

.certs-empty-text {
  font-family: 'Share Tech', sans-serif;
  font-size: 1.05rem;
  color: #9ca3af;
  margin: 0;
}

.certs-empty-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #4b5563;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .certs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .certs-folder-card.expanded {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .certs-section {
    padding: 40px 20px;
  }

  .certs-grid {
    grid-template-columns: 1fr;
  }

  .certs-folder-card.expanded {
    grid-column: span 1;
  }

  .certs-year-tabs {
    gap: 6px;
  }

  .certs-year-tab {
    padding: 5px 14px;
    font-size: 0.72rem;
  }
}
```

---

## Task 5: Page Route

**Files:**
- Create: `src/app/certificates/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// src/app/certificates/page.tsx
import type { Metadata } from 'next'
import NavBar from '../../Components/NavBar/NavBar'
import CertificatesSection from '../../Components/CertificatesSection/CertificatesSection'
import Footer from '../../Components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Certificates | AWSCC-SRMIST',
  description: 'Download your certificate from any AWS Cloud Club SRMIST event.',
}

export default function Certificates() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }}>
        <CertificatesSection />
      </div>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify the page loads**

Visit `http://localhost:3000/certificates`.  
Expected: Page renders with NavBar, SectionHeader ("Certificates"), and either loading spinner or empty state (if Drive not configured yet).

---

## Task 6: Events Page — Add Certificates Link

**Files:**
- Modify: `src/Components/EventsSection/EventsSection.jsx`

- [ ] **Step 1: Add the import and button**

In `EventsSection.jsx`, add `Link` import and the button below the `SectionHeader`:

```jsx
'use client'

import React from 'react';
import Link from 'next/link';
import SectionHeader from '../SectionHeader/SectionHeader';
import './EventsSection.css';

const EventsSection = () => {
  return (
    <section className="events-section">
      <div className="events-container">
        <SectionHeader title="Events" subtitle="Workshops, bootcamps, and more" />

        <div className="events-certs-link-wrap">
          <Link href="/certificates" className="events-certs-link">
            🎓 View Certificates
          </Link>
        </div>

        <div className="events-empty">
          <div className="events-empty-icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
              <rect x="10" y="18" width="60" height="52" rx="8" fill="rgba(184,54,254,0.1)" stroke="#B836FE" strokeWidth="1.5" />
              <rect x="10" y="18" width="60" height="16" rx="8" fill="rgba(184,54,254,0.2)" />
              <rect x="10" y="26" width="60" height="8" fill="rgba(184,54,254,0.2)" />
              <line x1="26" y1="10" x2="26" y2="26" stroke="#B836FE" strokeWidth="2" strokeLinecap="round" />
              <line x1="54" y1="10" x2="54" y2="26" stroke="#B836FE" strokeWidth="2" strokeLinecap="round" />
              <circle cx="40" cy="52" r="10" fill="rgba(184,54,254,0.15)" stroke="#FA46F2" strokeWidth="1.5" />
              <text x="40" y="57" textAnchor="middle" fill="#FA46F2" fontSize="12" fontFamily="monospace">?</text>
            </svg>
          </div>
          <p className="events-empty-text">Events Coming Soon</p>
          <p className="events-empty-sub">Follow us on social media to stay updated!</p>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
```

- [ ] **Step 2: Add styles to `EventsSection.css`**

Append to `src/Components/EventsSection/EventsSection.css`:

```css
.events-certs-link-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.events-certs-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: transparent;
  border: 1px solid rgba(184, 54, 254, 0.4);
  border-radius: 8px;
  color: #B836FE;
  font-family: 'Share Tech', sans-serif;
  font-size: 0.82rem;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.events-certs-link:hover {
  background: rgba(184, 54, 254, 0.1);
  border-color: #FA46F2;
  color: #FA46F2;
}
```

- [ ] **Step 3: Verify on Events page**

Visit `http://localhost:3000/events`.  
Expected: "🎓 View Certificates" button visible top-right of the events section. Clicking it navigates to `/certificates`.

---

## Task 7: End-to-End Verification

- [ ] **Step 1: Set up Drive folders with real data**

In your Google Drive `Certificates` folder:
```
Certificates/
  └── 2024/
        └── Test Event/
              └── Test_User.pdf   ← upload any PDF
```

- [ ] **Step 2: Verify full flow**

1. Visit `/certificates`
2. Year tabs should show `All Years` and `2024`
3. Click `2024` — only "Test Event" shows
4. Click "Test Event" folder — file list expands showing `Test_User`
5. Type "test" in search — `Test_User` stays visible
6. Type "xyz" — row dims
7. Click `⬇ Download` — PDF opens/downloads in new tab
8. Click the folder again — collapses

- [ ] **Step 3: Verify Events page link**

Visit `/events` → click "🎓 View Certificates" → lands on `/certificates`.

- [ ] **Step 4: Check mobile**

Resize browser to 375px width. Verify:
- Grid collapses to 1 column
- Year tabs wrap cleanly
- Search bar fits full width
- Expanded folder doesn't break layout
