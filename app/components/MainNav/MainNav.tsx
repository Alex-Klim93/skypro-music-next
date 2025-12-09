'use client';

import styles from './MainNav.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../services/auth/authSlice';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Получаем состояние авторизации из Redux
  const user = useAppSelector((state) => state.auth.user);

  // Устанавливаем флаг монтирования на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(logout());
      closeMenu();
      router.push('/');
    },
    [dispatch, router, closeMenu],
  );

  // Пока компонент не смонтирован, рендерим только логотип (для сервера)
  if (!isMounted) {
    return (
      <nav className={styles.main__nav}>
        <div className={styles.nav__logo}>
          <Link href="/">
            <Image
              width={113}
              height={17}
              className={styles.logo__image}
              src="/img/logo.png"
              alt="logo"
              priority
            />
          </Link>
        </div>
      </nav>
    );
  }

  // На клиенте рендерим полное меню
  const isLoggedIn = !!user;

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
            priority
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

          {isLoggedIn ? (
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
                <Link
                  href="#"
                  className={styles.menu__link}
                  onClick={handleLogout}
                >
                  Выйти
                </Link>
              </li>
            </>
          ) : (
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
