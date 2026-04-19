/**
 * Events data for the AWSCC-SRMIST website.
 *
 * HOW TO ADD A NEW EVENT:
 * 1. Create a subfolder in your Google Drive events folder.
 * 2. Upload all event photos into that subfolder.
 * 3. Copy the subfolder's ID from the URL (the long string after /folders/).
 * 4. Open the subfolder, pick the cover photo, copy its file ID from the URL.
 * 5. Add a new entry below following the same format.
 *
 * NOTE: Keep events in reverse-chronological order (newest first).
 */

export interface Event {
  id: string;
  title: string;
  date: string;
  folderId: string;      // Google Drive folder ID — contains all photos for this event
  coverImageId: string;  // Google Drive file ID for the cover/hero photo
  highlights: string[];  // Up to 3 bullet points shown on the card
}

export const events: Event[] = [
  {
    id: "club-inauguration-2026",
    title: "Club Inauguration",
    date: "20 April 2026",
    folderId: "1jzxVx5pnNH-heGDZyj_8LgkMkXTrQBru",
    coverImageId: "",
    highlights: [
      "Official launch of AWS Cloud Club SRMIST",
      "Meet the team & leadership",
      "Cloud journey kick-off",
    ],
  },
];
