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
      />,
    );

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('рендерится с корректными элементами при isOpen=true', () => {
    if (mockButtonRef.current) {
      mockButtonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="author"
        buttonRef={mockButtonRef}
      />,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('имеет корректные классы', () => {
    if (mockButtonRef.current) {
      mockButtonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    const { container } = render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="genre"
        buttonRef={mockButtonRef}
      />,
    );

    expect(container.querySelector('.filterPopup')).toBeInTheDocument();
    expect(container.querySelector('.filterContent')).toBeInTheDocument();
    expect(container.querySelector('.filterList')).toBeInTheDocument();
    expect(container.querySelectorAll('.filterItem')).toHaveLength(3);
  });

  test('вызывает onClose при клике вне фильтра', () => {
    if (mockButtonRef.current) {
      mockButtonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    render(
      <div>
        <button data-testid="outside-button">Outside Button</button>
        <Filter
          items={mockItems}
          isOpen={true}
          onClose={mockOnClose}
          filterType="year"
          buttonRef={mockButtonRef}
        />
      </div>,
    );

    fireEvent.mouseDown(screen.getByTestId('outside-button'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('не вызывает onClose при клике на элемент фильтра', () => {
    if (mockButtonRef.current) {
      mockButtonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    render(
      <Filter
        items={mockItems}
        isOpen={true}
        onClose={mockOnClose}
        filterType="author"
        buttonRef={mockButtonRef}
      />,
    );

    fireEvent.mouseDown(screen.getByText('Item 1'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('не вызывает onClose при клике на кнопку фильтра', () => {
    const mockButtonElement = document.createElement('button');
    mockButtonElement.textContent = 'Filter Button';
    const buttonRef = { current: mockButtonElement };

    if (buttonRef.current) {
      buttonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    render(
      <div>
        <button ref={buttonRef}>Filter Button</button>
        <Filter
          items={mockItems}
          isOpen={true}
          onClose={mockOnClose}
          filterType="author"
          buttonRef={buttonRef}
        />
      </div>,
    );

    fireEvent.mouseDown(screen.getByText('Filter Button'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('обрабатывает пустой массив items', () => {
    if (mockButtonRef.current) {
      mockButtonRef.current.getBoundingClientRect = jest.fn(() => ({
        bottom: 100,
        left: 50,
        width: 100,
        height: 40,
        top: 60,
        right: 150,
        x: 50,
        y: 60,
        toJSON: () => {},
      }));
    }

    render(
      <Filter
        items={[]}
        isOpen={true}
        onClose={mockOnClose}
        filterType="genre"
        buttonRef={mockButtonRef}
      />,
    );

    const filterItems = screen.queryAllByRole('listitem');
    expect(filterItems).toHaveLength(0);
  });
});
