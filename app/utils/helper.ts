import { TrackType } from '../sharedTypes/sharedTypes';

export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  const uniqueValues = new Set<string>();

  arr.forEach((item) => {
    const value = item[key];

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v && typeof v === 'string') {
          uniqueValues.add(v);
        }
      });
    } else if (typeof value === 'string') {
      uniqueValues.add(value);
    } else if (typeof value === 'number') {
      uniqueValues.add(value.toString());
    }
  });

  return Array.from(uniqueValues);
}

export function getUniqueGenreValues(tracks: TrackType[]): string[] {
  const uniqueGenres = new Set<string>();

  tracks.forEach((track) => {
    if (Array.isArray(track.genre)) {
      track.genre.forEach((genre) => {
        if (genre && typeof genre === 'string') {
          uniqueGenres.add(genre);
        }
      });
    }
  });

  return Array.from(uniqueGenres);
}

export function getUniqueYears(tracks: TrackType[]): string[] {
  const uniqueYears = new Set<string>();

  tracks.forEach((track) => {
    if (track.release_date && typeof track.release_date === 'string') {
      const year = track.release_date.split('-')[0];
      if (year) {
        uniqueYears.add(year);
      }
    }
  });

  return Array.from(uniqueYears);
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

  return `${minutes}:${outputSeconds}`;
}
