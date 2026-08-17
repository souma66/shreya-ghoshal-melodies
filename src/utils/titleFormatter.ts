export interface FormattedSong {
  title: string;
  subtitle?: string;
}

/**
 * Transforms raw video titles into elegant, typography-ready song titles and album/movie subtitles.
 */
export function formatSongTitle(rawTitle: string): FormattedSong {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return { title: 'Shreya Ghoshal Melodies', subtitle: 'Timeless Collection' };
  }

  let cleaned = rawTitle
    // Remove unwanted video tags, quality tags, and bracketed metadata
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?(Official|Full Video|Lyrical|Audio|Video Song|HD|4K|8K|Remastered|Lyric|HQ|Cover).*?\)/gi, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\|.*?(T-Series|Sony Music|Zee Music|Saregama|YRF|Tips|Venus|Eros).*?$/gi, '')
    .replace(/(Official Video|Full Video Song|Lyrical Song|Audio Song|8K Video|4K Video|Full Audio|Remastered)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split on pipe or hyphen if present
  if (cleaned.includes('|')) {
    const parts = cleaned.split('|').map(p => p.trim()).filter(Boolean);
    const mainTitle = parts[0] || cleaned;
    const albumOrDesc = parts[1] || '';
    return {
      title: cleanSongName(mainTitle),
      subtitle: cleanAlbumName(albumOrDesc),
    };
  }

  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        title: cleanSongName(parts[0]),
        subtitle: cleanAlbumName(parts[1]),
      };
    }
  }

  return {
    title: cleanSongName(cleaned),
    subtitle: undefined,
  };
}

function cleanSongName(str: string): string {
  return str
    .replace(/^(Song\s*:|Title\s*:|Track\s*:)\s*/i, '')
    .replace(/\bShreya Ghoshal\b/gi, '')
    .replace(/[-|:]+$/g, '')
    .replace(/^[-|:]+/g, '')
    .trim() || 'Shreya Ghoshal Melodies';
}

function cleanAlbumName(str: string): string {
  return str
    .replace(/^(Movie\s*:|Film\s*:|Album\s*:)\s*/i, '')
    .replace(/\b(Shreya Ghoshal|Arijit Singh|Deepika Padukone|Ranveer Singh|Shah Rukh Khan)\b/gi, '')
    .replace(/[-|:]+$/g, '')
    .replace(/^[-|:]+/g, '')
    .trim();
}

/**
 * Format seconds to standard mm:ss
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
