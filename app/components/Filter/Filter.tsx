import styles from './Filter.module.css';
import { useEffect, useRef } from 'react';

interface FilterProps {
  items: string[];
  isOpen: boolean;
  onClose: () => void;
  filterType: 'author' | 'year' | 'genre' | null;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
  selectedValues: string[];
  onSelect: (value: string | null) => void;
}

export default function Filter({
  items,
  isOpen,
  onClose,
  filterType,
  buttonRef,
  selectedValues,
  onSelect,
}: FilterProps) {
  const filterContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterContentRef.current &&
        !filterContentRef.current.contains(event.target as Node) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen || !buttonRef?.current) return null;

  const buttonRect = buttonRef.current.getBoundingClientRect();

  const popupStyle = {
    position: 'fixed' as const,
    top: buttonRect.bottom + window.scrollY + 5 + 'px',
    left: buttonRect.left + window.scrollX + 'px',
  };

  const handleAllClick = () => {
    onSelect(null); // Сброс всех выбранных значений
    onClose();
  };

  const handleItemClick = (item: string) => {
    onSelect(item); // Передаем значение, обработка (добавить/удалить) в родителе
    // Не закрываем попап, чтобы можно было выбрать несколько
  };

  return (
    <div className={styles.filterPopup}>
      <div
        className={styles.filterContent}
        ref={filterContentRef}
        style={popupStyle}
      >
        <div className={styles.filterList}>
          {/* Пункт "Все" - подсвечивается если ничего не выбрано */}
          <div
            className={`${styles.filterItem} ${selectedValues.length === 0 ? styles.filterItemSelected : ''}`}
            onClick={handleAllClick}
          >
            Все
          </div>

          {/* Остальные пункты - подсвечивается если элемент выбран */}
          {items.map((item, index) => (
            <div
              key={index}
              className={`${styles.filterItem} ${selectedValues.includes(item) ? styles.filterItemSelected : ''}`}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
