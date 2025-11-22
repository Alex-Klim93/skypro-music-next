// MainNav.tsx
'use client';

import styles from './MainNav.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Link href="/" onClick={closeMenu}>
          <Image
            width={113}
            height={17}
            className={styles.logo__image}
            src="/img/logo.png"
            alt="logo"
          />
        </Link>
      </div>

      {/* Бургер меню */}
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>

      {/* Выпадающее меню */}
      <div
        className={`${styles.nav__menu} ${isMenuOpen ? styles.menu__open : ''}`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link} onClick={closeMenu}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href="/playlist"
              className={styles.menu__link}
              onClick={closeMenu}
            >
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href="/Signin"
              className={styles.menu__link}
              onClick={closeMenu}
            >
              Войти
            </Link>
          </li>
        </ul>
      </div>

      {/* Оверлей для закрытия меню при клике вне его */}
      {isMenuOpen && (
        <div className={styles.menu__overlay} onClick={closeMenu}></div>
      )}
    </nav>
  );
}
