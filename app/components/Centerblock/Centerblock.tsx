'use client';

import styles from './Centerblock.module.css';
import classNames from 'classnames';
import Search from '../Search/Search';
import {
  getUniqueValuesByKey,
  getUniqueGenreValues,
  getUniqueYears,
} from '@/app/utils/helper';
import { useState, useRef } from 'react';
import Filter from '../Filter/Filter';
import Track from '../Track/Track';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

interface CenterblockProps {
  tracks: TrackType[];
  title?: string;
}

export default function Centerblock({
  tracks,
  title = 'Треки',
}: CenterblockProps) {
  const [activeFilter, setActiveFilter] = useState<
    'author' | 'year' | 'genre' | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]); // Массив для нескольких авторов
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Массив для нескольких жанров
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // Массив для нескольких годов

  // Refs для кнопок фильтров
  const authorButtonRef = useRef<HTMLButtonElement>(null);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const genreButtonRef = useRef<HTMLButtonElement>(null);

  const uniqueAuthors = getUniqueValuesByKey(tracks, 'author');
  const uniqueGenres = getUniqueGenreValues(tracks);
  const uniqueYears = getUniqueYears(tracks);

  // Функция фильтрации треков
  const getFilteredTracks = () => {
    return tracks.filter((track) => {
      // Поиск
      const matchesSearch =
        !searchQuery ||
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтр по автору (проверяем все выбранные авторы)
      const matchesAuthor =
        selectedAuthors.length === 0 || selectedAuthors.includes(track.author);

      // Фильтр по жанру (проверяем все выбранные жанры)
      const matchesGenre =
        selectedGenres.length === 0 ||
        (Array.isArray(track.genre) &&
          track.genre.some((genre) => selectedGenres.includes(genre)));

      // Фильтр по году
      const matchesYear =
        selectedYears.length === 0 ||
        (track.release_date &&
          selectedYears.some((year) => track.release_date.startsWith(year)));

      return matchesSearch && matchesAuthor && matchesGenre && matchesYear;
    });
  };

  const filteredTracks = getFilteredTracks();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = (filterName: 'author' | 'year' | 'genre') => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
  };

  const handleFilterSelect = (value: string | null) => {
    if (!activeFilter) return;

    if (value === null) {
      // Сброс всех выбранных значений для этого фильтра
      if (activeFilter === 'author') {
        setSelectedAuthors([]);
      } else if (activeFilter === 'genre') {
        setSelectedGenres([]);
      } else if (activeFilter === 'year') {
        setSelectedYears([]);
      }
    } else {
      // Добавление/удаление значения из массива
      if (activeFilter === 'author') {
        setSelectedAuthors(
          (prev) =>
            prev.includes(value)
              ? prev.filter((item) => item !== value) // Удаляем если уже есть
              : [...prev, value], // Добавляем если нет
        );
      } else if (activeFilter === 'genre') {
        setSelectedGenres((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        );
      } else if (activeFilter === 'year') {
        setSelectedYears((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        );
      }
    }
  };

  const getFilterItems = () => {
    switch (activeFilter) {
      case 'author':
        return uniqueAuthors;
      case 'genre':
        return uniqueGenres;
      case 'year':
        return uniqueYears;
      default:
        return [];
    }
  };

  const getButtonRef = () => {
    switch (activeFilter) {
      case 'author':
        return authorButtonRef;
      case 'genre':
        return genreButtonRef;
      case 'year':
        return yearButtonRef;
      default:
        return null;
    }
  };

  const getSelectedValues = () => {
    switch (activeFilter) {
      case 'author':
        return selectedAuthors;
      case 'genre':
        return selectedGenres;
      case 'year':
        return selectedYears;
      default:
        return [];
    }
  };

  // Получаем количество выбранных значений для каждого фильтра
  const authorCount = selectedAuthors.length;
  const genreCount = selectedGenres.length;
  const yearCount = selectedYears.length;

  return (
    <div className={styles.centerblock}>
      <Search onSearch={handleSearch} />
      <h2 className={styles.centerblock__h2}>{title}</h2>

      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        <button
          ref={authorButtonRef}
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'author',
          })}
          onClick={() => handleFilterClick('author')}
        >
          исполнителю
          {authorCount > 0 && (
            <span className={styles.filterBadge}>{authorCount}</span>
          )}
        </button>

        <button
          ref={yearButtonRef}
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'year',
          })}
          onClick={() => handleFilterClick('year')}
        >
          году выпуска
          {yearCount > 0 && (
            <span className={styles.filterBadge}>{yearCount}</span>
          )}
        </button>

        <button
          ref={genreButtonRef}
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'genre',
          })}
          onClick={() => handleFilterClick('genre')}
        >
          жанру
          {genreCount > 0 && (
            <span className={styles.filterBadge}>{genreCount}</span>
          )}
        </button>

        <Filter
          items={getFilterItems()}
          isOpen={activeFilter !== null}
          onClose={handleCloseFilter}
          filterType={activeFilter}
          buttonRef={getButtonRef()}
          selectedValues={getSelectedValues()}
          onSelect={handleFilterSelect}
        />
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, index) => (
              <Track
                key={track._id}
                track={track}
                playlist={filteredTracks}
                index={index}
              />
            ))
          ) : (
            <div className={styles.emptyTracks}>
              <p>По вашему запросу ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
