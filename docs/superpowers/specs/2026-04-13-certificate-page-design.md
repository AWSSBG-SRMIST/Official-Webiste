# Certificate Page — Design Spec
**Date:** 2026-04-13  
**Project:** AWS Cloud Club SRMIST Website  
**Status:** Approved

---

## Overview

A new `/certificates` page that lets any club member find and download their certificate from any past AWS Cloud Club event. Certificates are stored in Google Drive. The page fetches them via the Google Drive API — no backend required.

A "Certificates" button is added to the Events page (`/events`) linking to this page.

---

## Google Drive Structure

```
Certificates/                    ← root folder (NEXT_PUBLIC_CERTS_ROOT_FOLDER_ID)
  └── 2025/                      ← year folder
        └── GenAI Summit/        ← event folder
              └── Rohit_Kumar.pdf
  └── 2024/                      ← year folder
        └── Cloud Bootcamp/
              └── Rohit_Kumar.pdf
              └── Ananya_Singh.pdf
        └── Hackathon 2024/
              └── ...
  └── 2023/
        └── Orientation 2023/
              └── ...
```

- Root folder and all subfolders set to **"Anyone with the link → Viewer"**
- Certificate files named as `Firstname_Lastname.pdf` (or similar) for search to work on name
- Year folders are the direct children of root; event folders are inside year folders

---

## Environment Variables

```env
NEXT_PUBLIC_CERTS_ROOT_FOLDER_ID=<Google Drive root folder ID>
NEXT_PUBLIC_DRIVE_API_KEY=<Google Drive API Key, restricted to Drive API>
```

---

## Page: `/certificates`

### Route
`src/app/certificates/page.tsx` — Next.js page (metadata exported, NavBar + Footer included, 70px paddingTop consistent with other pages)

### Component
`src/Components/CertificatesSection/CertificatesSection.jsx` + `CertificatesSection.css`

---

## Data Fetching

All fetching done client-side using Google Drive API v3. No server-side calls.

### Step 1 — Fetch year folders
```
GET https://www.googleapis.com/drive/v3/files
  ?q='ROOT_FOLDER_ID' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false
  &fields=files(id,name)
  &key=API_KEY
```

### Step 2 — Fetch event folders per year (on year tab select or on mount for "All")
```
GET https://www.googleapis.com/drive/v3/files
  ?q='YEAR_FOLDER_ID' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false
  &fields=files(id,name)
  &key=API_KEY
```

### Step 3 — Fetch certificates inside an event folder (on folder click/expand)
```
GET https://www.googleapis.com/drive/v3/files
  ?q='EVENT_FOLDER_ID' in parents and trashed=false
  &fields=files(id,name,mimeType)
  &key=API_KEY
```

### Download
Direct Google Drive download link per file:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```
Opened via `window.open(url, '_blank')` on button click.

---

## UI Components & Behaviour

### Search Bar
- Single input at top of page: `placeholder="Search by name — e.g. Rohit Kumar"`
- Filters certificate file names **across all expanded folders** in real time (case-insensitive)
- Does not trigger a new API call — filters already-fetched results in state
- Non-matching certificates are dimmed (opacity 0.4), not hidden, so the user can still see the full list

### Year Filter Tabs
- Tabs: `All Years` + one tab per year folder fetched from Drive (sorted descending: 2025, 2024, 2023…)
- `All Years` selected by default — fetches event folders for all years on mount
- Selecting a year tab filters the visible event folders to that year only
- Active tab: purple border + highlighted text. Inactive: muted border

### Event Folder Grid
- 3-column grid on desktop, 2-column on tablet (≤768px), 1-column on mobile (≤480px)
- Each folder card shows: folder emoji 📁, event name, certificate count, year badge
- Click a folder → expands **inline** (card widens to span remaining columns using CSS grid tricks or absolute overlay — keep it simple: just re-renders below the grid as an expanded panel)
- Only one folder expanded at a time; clicking another closes the current one
- Expanded state: folder emoji changes to 📂, border highlights in purple

### Certificate List (inside expanded folder)
- Vertical list of certificate rows
- Each row: 📄 icon + filename + `⬇ Download` button (gradient purple)
- Download button opens the Google Drive download URL in a new tab
- Search filter applies here: non-matching rows dimmed

### Loading & Empty States
- Initial load: spinner + "Fetching certificates..." text (consistent with GallerySection style)
- No folders found: empty state SVG + "No certificates yet. Check back after our next event!"
- Folder fetch error: "Failed to load. Please try again." with a retry button

---

## Events Page Change

In `src/Components/EventsSection/EventsSection.jsx`, add a subtle button/link below the section header:

```
[🎓 View Certificates →]   ← links to /certificates
```

Styled consistent with existing secondary buttons on the site (transparent bg, purple border).

---

## File Structure

```
src/
  app/
    certificates/
      page.tsx                        ← new route
  Components/
    CertificatesSection/
      CertificatesSection.jsx         ← main component
      CertificatesSection.css         ← styles
```

---

## Out of Scope
- Certificate preview/viewer (just download)
- Authentication or access control (page is public)
- Upload interface (Drive managed manually by club leads)
- Certificate generation
