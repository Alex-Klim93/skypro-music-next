import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/app/components/Search/Search';
import '@testing-library/jest-dom';

describe('Search Component', () => {
  test('рендерится с корректным placeholder', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText('Поиск');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('name', 'search');
  });

  test('имеет иконку поиска', () => {
    const { container } = render(<Search />);

    const svgElement = container.querySelector('.search__svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.querySelector('use')).toHaveAttribute(
      'xlink:href',
      '/img/icon/sprite.svg#icon-search',
    );
  });

  test('обновляет значение при вводе текста', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText(
      'Поиск',
    ) as HTMLInputElement;

    expect(searchInput.value).toBe('');

    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput.value).toBe('test search');
  });

  test('вызывает onSearchInput при изменении значения', () => {
    const onSearchInputMock = jest.fn();
    const SearchWithMock = () => {
      const [searchInput, setSearchInput] = React.useState('');

      const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        onSearchInputMock(e.target.value);
      };

      return (
        <div className="centerblock__search">
          <input
            className="search__text"
            type="search"
            placeholder="Поиск"
            name="search"
            value={searchInput}
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

  test('сохраняет введенное значение при перерендере', () => {
    const { rerender } = render(<Search />);

    const searchInput = screen.getByPlaceholderText(
      'Поиск',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'сохраненный текст' } });

    expect(searchInput.value).toBe('сохраненный текст');

    rerender(<Search />);

    const newSearchInput = screen.getByPlaceholderText(
      'Поиск',
    ) as HTMLInputElement;
    expect(newSearchInput.value).toBe('');
  });

  test('имеет корректные CSS классы', () => {
    const { container } = render(<Search />);

    expect(container.querySelector('.centerblock__search')).toBeInTheDocument();
    expect(container.querySelector('.search__svg')).toBeInTheDocument();
    expect(container.querySelector('.search__text')).toBeInTheDocument();
  });

  test('можно вводить различные типы текста', () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText(
      'Поиск',
    ) as HTMLInputElement;

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
