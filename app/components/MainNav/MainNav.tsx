'use client';

import styles from './MainNav.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    router.push('/Signin');
    closeMenu();
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

      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>

      <div
        className={`${styles.nav__menu} ${isMenuOpen ? styles.menu__open : ''}`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link
              href="/"
              className={`${styles.menu__link} ${pathname === '/' ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Главная
            </Link>
          </li>

          {isLoggedIn && (
            <>
              <li className={styles.menu__item}>
                <Link
                  href="/MyTracks"
                  className={`${styles.menu__link} ${pathname === '/MyTracks' ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Мой плейлист
                </Link>
              </li>

              <li className={styles.menu__item}>
                <Link onClick={handleLogout} className={styles.menu__link} href={''}>
                  Выйти
                </Link>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li className={styles.menu__item}>
              <Link
                href="/Signin"
                className={`${styles.menu__link} ${pathname === '/Signin' ? styles.active : ''}`}
                onClick={closeMenu}
              >
                Войти
              </Link>
            </li>
          )}
        </ul>
      </div>

      {isMenuOpen && (
        <div className={styles.menu__overlay} onClick={closeMenu}></div>
      )}
    </nav>
  );
}
