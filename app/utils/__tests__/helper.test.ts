import {
  getUniqueValuesByKey,
  getUniqueGenreValues,
  getUniqueYears,
  formatTime,
} from '@/app/utils/helper';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

describe('Helper functions', () => {
  const mockTracks: TrackType[] = [
    {
      _id: 1,
      name: 'Track 1',
      author: 'Author 1',
      album: 'Album 1',
      duration_in_seconds: 185,
      release_date: '2020-01-01',
      genre: ['Rock', 'Pop'],
      likes_count: 10,
    },
    {
      _id: 2,
      name: 'Track 2',
      author: 'Author 2',
      album: 'Album 2',
      duration_in_seconds: 245,
      release_date: '2021-05-15',
      genre: ['Pop'],
      likes_count: 5,
    },
    {
      _id: 3,
      name: 'Track 3',
      author: 'Author 1',
      album: 'Album 3',
      duration_in_seconds: 195,
      release_date: '2019-12-31',
      genre: ['Rock', 'Metal'],
      likes_count: 15,
    },
    {
      _id: 4,
      name: 'Track 4',
      author: 'Author 3',
      album: 'Album 4',
      duration_in_seconds: 125,
      release_date: '2021-07-20',
      genre: ['Jazz'],
      likes_count: 8,
    },
  ];

  describe('getUniqueValuesByKey', () => {
    test('возвращает уникальных авторов', () => {
      const result = getUniqueValuesByKey(mockTracks, 'author');
      expect(result).toEqual(['Author 1', 'Author 2', 'Author 3']);
    });

    test('возвращает уникальные названия треков', () => {
      const result = getUniqueValuesByKey(mockTracks, 'name');
      expect(result).toEqual(['Track 1', 'Track 2', 'Track 3', 'Track 4']);
    });

    test('возвращает уникальные альбомы', () => {
      const result = getUniqueValuesByKey(mockTracks, 'album');
      expect(result).toEqual(['Album 1', 'Album 2', 'Album 3', 'Album 4']);
    });

    test('возвращает пустой массив для несуществующего ключа', () => {
      const result = getUniqueValuesByKey(mockTracks, 'unknown_key' as any);
      expect(result).toEqual([]);
    });

    test('обрабатывает треки без значения для ключа', () => {
      const tracksWithMissingAuthor = [
        ...mockTracks,
        { ...mockTracks[0], author: undefined },
      ];
      const result = getUniqueValuesByKey(tracksWithMissingAuthor, 'author');
      expect(result).toEqual(['Author 1', 'Author 2', 'Author 3']);
    });
  });

  describe('getUniqueGenreValues', () => {
    test('возвращает уникальные жанры', () => {
      const result = getUniqueGenreValues(mockTracks);
      expect(result.sort()).toEqual(['Rock', 'Pop', 'Metal', 'Jazz'].sort());
    });

    test('устраняет дублирование жанров', () => {
      const tracksWithDuplicates = [
        ...mockTracks,
        {
          ...mockTracks[0],
          _id: 5,
          genre: ['Rock', 'Pop'],
        },
      ];
      const result = getUniqueGenreValues(tracksWithDuplicates);
      expect(result.sort()).toEqual(['Rock', 'Pop', 'Metal', 'Jazz'].sort());
    });

    test('обрабатывает треки без жанра', () => {
      const tracksWithoutGenre = [
        { ...mockTracks[0], genre: undefined },
        { ...mockTracks[1], genre: [] },
      ];
      const result = getUniqueGenreValues(tracksWithoutGenre);
      expect(result).toEqual([]);
    });

    test('обрабатывает пустой массив треков', () => {
      const result = getUniqueGenreValues([]);
      expect(result).toEqual([]);
    });
  });

  describe('getUniqueYears', () => {
    test('возвращает уникальные года выпуска', () => {
      const result = getUniqueYears(mockTracks);
      expect(result.sort()).toEqual(['2020', '2021', '2019'].sort());
    });

    test('устраняет дублирование годов', () => {
      const tracksWithSameYear = [
        ...mockTracks,
        {
          ...mockTracks[0],
          _id: 5,
          release_date: '2021-08-01',
        },
      ];
      const result = getUniqueYears(tracksWithSameYear);
      expect(result.sort()).toEqual(['2020', '2021', '2019'].sort());
    });

    test('обрабатывает треки без даты релиза', () => {
      const tracksWithoutDate = [
        { ...mockTracks[0], release_date: undefined },
        { ...mockTracks[1], release_date: '' },
        { ...mockTracks[2], release_date: 'некорректная-дата' },
      ];
      const result = getUniqueYears(tracksWithoutDate);
      expect(result).toEqual([]);
    });

    test('обрабатывает пустой массив треков', () => {
      const result = getUniqueYears([]);
      expect(result).toEqual([]);
    });
  });

  describe('formatTime', () => {
    test('форматирует время менее 10 секунд', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(9)).toBe('0:09');
    });

    test('форматирует время более 10 секунд', () => {
      expect(formatTime(10)).toBe('0:10');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(125)).toBe('2:05');
    });

    test('форматирует время в минутах', () => {
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(600)).toBe('10:00');
    });

    test('форматирует большое время', () => {
      expect(formatTime(3661)).toBe('61:01');
    });

    test('обрабатывает отрицательное время', () => {
      expect(formatTime(-1)).toBe('-0:01');
      expect(formatTime(-60)).toBe('-1:00');
    });
  });
});
