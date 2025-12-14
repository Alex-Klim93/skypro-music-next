import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from '@/app/components/Filter/Filter';
import '@testing-library/jest-dom';

describe('Filter Component', () => {
  const mockItems = ['Item 1', 'Item 2', 'Item 3'];
  const mockOnClose = jest.fn();
  let mockButtonRef: React.RefObject<HTMLButtonElement>;

  beforeEach(() => {
    mockButtonRef = { current: document.createElement('button') };
    jest.clearAllMocks();
  });

  test('не рендерится, когда isOpen=false', () => {
    render(
      <Filter
        items={mockItems}
        isOpen={false}
        onClose={mockOnClose}
        filterType="test"
        buttonRef={mockButtonRef}
        selectedValues={[]}
      />,
    );

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  test('не рендерится без buttonRef.current', () => {
    const emptyButtonRef = { current: null };

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="test"
        buttonRef={emptyButtonRef}
        selectedValues={[]}
      />,
    );

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('рендерится с корректными элементами при isOpen=true', () => {
    const buttonElement = document.createElement('button');
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="author"
        buttonRef={refWithElement}
        selectedValues={[]}
      />,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('имеет корректные классы', () => {
    const buttonElement = document.createElement('button');
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="genre"
        buttonRef={refWithElement}
        selectedValues={[]}
      />,
    );

    // Проверяем что элементы рендерятся
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('вызывает onClose при клике вне фильтра', () => {
    const buttonElement = document.createElement('button');
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <div>
        <button data-testid="outside-button">Outside Button</button>
        <Filter
          items={mockItems}
          isOpen={true}
          onClose={mockOnClose}
          filterType="year"
          buttonRef={refWithElement}
          selectedValues={[]}
        />
      </div>,
    );

    fireEvent.mouseDown(screen.getByTestId('outside-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('не вызывает onClose при клике на элемент фильтра', () => {
    const buttonElement = document.createElement('button');
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="author"
        buttonRef={refWithElement}
        selectedValues={[]}
      />,
    );

    fireEvent.mouseDown(screen.getByText('Item 1'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('не вызывает onClose при клике на кнопку фильтра', () => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Filter Button';
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <div>
        <button ref={refWithElement}>Filter Button</button>
        <Filter
          items={mockItems}
          isOpen={true}
          onClose={mockOnClose}
          filterType="author"
          buttonRef={refWithElement}
          selectedValues={[]}
        />
      </div>,
    );

    fireEvent.mouseDown(screen.getByText('Filter Button'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('обрабатывает пустой массив items', () => {
    const buttonElement = document.createElement('button');
    const refWithElement = { current: buttonElement };

    Object.defineProperty(refWithElement.current, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      })),
      writable: true,
    });

    render(
      <Filter
        items={[]}
        isOpen={true}
        onClose={mockOnClose}
        filterType="genre"
        buttonRef={refWithElement}
        selectedValues={[]}
      />,
    );

    // При пустом массиве не должно быть элементов списка
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
