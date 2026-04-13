// src/Components/CertificatesSection/driveApi.js

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
  const res = await fetch(`${BASE}?q=${q}&fields=files(id,name)&pageSize=1000&key=${API_KEY}`);
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
  const res = await fetch(`${BASE}?q=${q}&fields=files(id,name)&pageSize=1000&key=${API_KEY}`);
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
  return results.flat().sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
}
