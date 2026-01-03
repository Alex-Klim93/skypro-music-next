import styles from './Filter.module.css';
import { useEffect, useRef } from 'react';

interface FilterProps {
  items: string[];
  isOpen: boolean;
  onClose: () => void;
  filterType: string | null;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
}

export default function Filter({
  items,
  isOpen,
  onClose,
  filterType,
  buttonRef,
}: FilterProps) {
  const filterContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Если клик был не по контенту фильтра и не по кнопке фильтра
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

  // Получаем позицию кнопки
  const buttonRect = buttonRef.current.getBoundingClientRect();

  const popupStyle = {
    position: 'fixed' as const,
    top: buttonRect.bottom + window.scrollY + 5 + 'px', // 5px отступ от кнопки
    left: buttonRect.left + window.scrollX + 'px',
  };

  return (
    <div className={styles.filterPopup}>
      <div
        className={styles.filterContent}
        ref={filterContentRef}
        style={popupStyle}
      >
        <div className={styles.filterList}>
          {items.map((item, index) => (
            <div key={index} className={styles.filterItem}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
