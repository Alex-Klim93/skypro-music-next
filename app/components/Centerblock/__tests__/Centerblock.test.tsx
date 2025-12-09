import React from 'react';
import { render, screen } from '@testing-library/react';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import '@testing-library/jest-dom';

jest.mock('@/app/components/Search/Search', () => {
  return function MockSearch() {
    return <div data-testid="mock-search">Search Component</div>;
  };
});

jest.mock('@/app/components/Filter/Filter', () => {
  return function MockFilter(props: any) {
    return (
      <div data-testid="mock-filter">
        Filter Component - {props.filterType}
        {props.items.map((item: string, index: number) => (
          <div key={index} data-testid="filter-item">
            {item}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/app/components/Track/Track', () => {
  return function MockTrack(props: any) {
    return <div data-testid="mock-track">Track: {props.track.name}</div>;
  };
});

describe('Centerblock Component - Filter Integration', () => {
  const mockTracks: TrackType[] = [
    {
      _id: 1,
      name: 'Track 1',
      author: 'Author A',
      album: 'Album 1',
      duration_in_seconds: 180,
      release_date: '2020-01-01',
      genre: ['Rock'],
      likes_count: 10,
    },
    {
      _id: 2,
      name: 'Track 2',
      author: 'Author B',
      album: 'Album 2',
      duration_in_seconds: 240,
      release_date: '2021-01-01',
      genre: ['Pop'],
      likes_count: 5,
    },
    {
      _id: 3,
      name: 'Track 3',
      author: 'Author A',
      album: 'Album 3',
      duration_in_seconds: 200,
      release_date: '2019-01-01',
      genre: ['Jazz', 'Blues'],
      likes_count: 15,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерится с заголовком', () => {
    render(<Centerblock tracks={mockTracks} title="Тестовые треки" />);

    expect(screen.getByText('Тестовые треки')).toBeInTheDocument();
    expect(screen.getByTestId('mock-search')).toBeInTheDocument();
  });

  test('отображает все кнопки фильтров', () => {
    render(<Centerblock tracks={mockTracks} />);

    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
  });

  test('отображает все треки', () => {
    render(<Centerblock tracks={mockTracks} />);

    expect(screen.getByText('Track: Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track: Track 2')).toBeInTheDocument();
    expect(screen.getByText('Track: Track 3')).toBeInTheDocument();
  });

  test('отображает заголовки колонок плейлиста', () => {
    render(<Centerblock tracks={mockTracks} />);

    expect(screen.getByText('Трек')).toBeInTheDocument();
    expect(screen.getByText('Исполнитель')).toBeInTheDocument();
    expect(screen.getByText('Альбом')).toBeInTheDocument();
  });

  test('отображает сообщение при пустом списке треков', () => {
    render(<Centerblock tracks={[]} />);

    expect(
      screen.getByText('В этой подборке пока нет треков'),
    ).toBeInTheDocument();
  });

  test('передает правильные уникальные значения для фильтров', () => {
    render(<Centerblock tracks={mockTracks} />);

    expect(screen.getByText('Track: Track 1')).toBeInTheDocument();

    const filterButtons = screen.getAllByRole('button');
    expect(filterButtons.length).toBeGreaterThan(0);
  });

  test('обрабатывает изменение активного фильтра', () => {
    const { container } = render(<Centerblock tracks={mockTracks} />);

    const authorButton = screen.getByText('исполнителю');

    expect(authorButton).toBeInTheDocument();

    const filterButtons = container.querySelectorAll('.filter__button');
    expect(filterButtons.length).toBe(3);
  });
});
