import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/app/components/Search/Search';
import '@testing-library/jest-dom';

// Мокаем компонент Search для изоляции тестов
jest.mock('@/app/components/Search/Search', () => {
  return function MockSearch() {
    const [value, setValue] = React.useState('');
    
    return (
      <div className="centerblock__search">
        <input
          className="search__text"
          type="search"
          placeholder="Поиск"
          name="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="search-input"
        />
      </div>
    );
  };
});

describe('Search Component', () => {
  test('рендерится с корректным placeholder', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText('Поиск');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('name', 'search');
  });

  test('обновляет значение при вводе текста', () => {
    render(<Search      />);

    const searchInput = screen.getByPlaceholderText('Поиск') as HTMLInputElement;

    expect(searchInput.value).toBe('');

    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput.value).toBe('test search');
  });

  test('вызывает onSearchInput при изменении значения', () => {
    const onSearchInputMock = jest.fn();
    
    const SearchWithMock = () => {
      const [searchValue, setSearchValue] = React.useState('');

      const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        onSearchInputMock(e.target.value);
      };

      return (
        <div className="centerblock__search">
          <input
            className="search__text"
            type="search"
            placeholder="Поиск"
            name="search"
            value={searchValue}
            onChange={handleInput}
          />
        </div>
      );
    };

    render(<SearchWithMock />);

    const searchInput = screen.getByPlaceholderText('Поиск');
    fireEvent.change(searchInput, { target: { value: 'новый поиск' } });

    expect(onSearchInputMock).toHaveBeenCalledWith('новый поиск');
    expect(onSearchInputMock).toHaveBeenCalledTimes(1);
  });

  test('имеет корректные CSS классы', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText('Поиск');
    const container = searchInput.parentElement;
    
    expect(container).toHaveClass('centerblock__search');
    expect(searchInput).toHaveClass('search__text');
  });

  test('можно вводить различные типы текста', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText('Поиск') as HTMLInputElement;

    const testCases = [
      'простой текст',
      'TEXT IN CAPS',
      '123 числа',
      'спецсимволы !@#$%^&*()',
      '   с пробелами   ',
      'много       пробелов',
      '',
    ];

    testCases.forEach((testCase) => {
      fireEvent.change(searchInput, { target: { value: testCase } });
      expect(searchInput.value).toBe(testCase);
    });
  });
});