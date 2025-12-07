import { TrackType } from '@/app/sharedTypes/sharedTypes';

export type FilterState = {
  searchQuery: string;
  authorFilter: string | null;
  genreFilter: string | null;
  sortBy: 'default' | 'name' | 'author' | 'year' | 'duration';
  sortOrder: 'asc' | 'desc';
};

export function filterAndSortTracks(
  tracks: TrackType[],
  filterState: FilterState,
): TrackType[] {
  let filteredTracks = [...tracks];

  // Поиск по названию, автору и альбому
  if (filterState.searchQuery.trim()) {
    const query = filterState.searchQuery.toLowerCase().trim();
    filteredTracks = filteredTracks.filter(
      (track) =>
        track.name.toLowerCase().includes(query) ||
        track.author.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query),
    );
  }

  // Фильтрация по автору
  if (filterState.authorFilter) {
    filteredTracks = filteredTracks.filter(
      (track) => track.author === filterState.authorFilter,
    );
  }

  // Фильтрация по жанру
  if (filterState.genreFilter) {
    filteredTracks = filteredTracks.filter(
      (track) =>
        Array.isArray(track.genre) &&
        track.genre.includes(filterState.genreFilter!),
    );
  }

  // Сортировка
  filteredTracks.sort((a, b) => {
    let compareValue = 0;

    switch (filterState.sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'author':
        compareValue = a.author.localeCompare(b.author);
        break;
      case 'year':
        const yearA = a.release_date
          ? parseInt(a.release_date.split('-')[0])
          : 0;
        const yearB = b.release_date
          ? parseInt(b.release_date.split('-')[0])
          : 0;
        compareValue = yearA - yearB;
        break;
      case 'duration':
        compareValue = a.duration_in_seconds - b.duration_in_seconds;
        break;
      default:
        compareValue = 0;
    }

    return filterState.sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return filteredTracks;
}
