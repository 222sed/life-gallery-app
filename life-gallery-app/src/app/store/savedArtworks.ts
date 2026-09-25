const STORAGE_KEY = "life-gallery-saved-artworks";

export type ArtworkDestination = "gallery" | "sketch";

export interface SavedArtwork {
  id: string;
  title: string;
  emotionTags: string[];
  description: string;
  date: string;
  style: string;
  imageUrl: string;
  destination: ArtworkDestination;
  savedAt: number;
}

function readAll(): SavedArtwork[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (_) {
    return [];
  }
}

export function getSavedArtworks(destination: ArtworkDestination): SavedArtwork[] {
  return readAll()
    .filter((artwork) => artwork.destination === destination)
    .sort((a, b) => b.savedAt - a.savedAt);
}

export function saveArtwork(
  artwork: Omit<SavedArtwork, "id" | "destination" | "savedAt">,
  destination: ArtworkDestination,
) {
  const savedAt = Date.now();
  const existing = readAll().filter((item) => item.imageUrl !== artwork.imageUrl);
  const next: SavedArtwork = {
    ...artwork,
    id: `saved-${savedAt}`,
    destination,
    savedAt,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...existing].slice(0, 40)));
  } catch (_) {
    // The generated image is stored as a URL, so quota errors should be rare.
  }

  return next;
}
