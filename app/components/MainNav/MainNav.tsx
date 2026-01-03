'use client';

import styles from './MainNav.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../services/auth/authSlice';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Получаем состояние авторизации из Redux
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useMemo(() => !!user, [user]);

  // Оптимизация с useCallback
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Оптимизация с useCallback для выхода
  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Редирект на главную страницу после выхода
    if (pathname.includes('favorites') || pathname.includes('MyTracks')) {
      router.push('/');
    } else {
      router.push('/Signin');
    }
    closeMenu();
  }, [dispatch, router, pathname, closeMenu]);

  // Оптимизация с useMemo для меню
  const menuItems = useMemo(() => {
    const items = [
      {
        href: '/',
        label: 'Главная',
        isActive: pathname === '/',
        onClick: closeMenu,
      },
    ];

    if (isLoggedIn) {
      items.push(
        {
          href: '/MyTracks',
          label: 'Мой плейлист',
          isActive: pathname === '/MyTracks',
          onClick: closeMenu,
        },
        {
          href: '#', // Используем # для ссылки
          label: 'Выйти',
          isActive: false,
          onClick: handleLogout,
        },
      );
    } else {
      items.push({
        href: '/Signin',
        label: 'Войти',
        isActive: pathname === '/Signin',
        onClick: closeMenu,
      });
    }

    return items;
  }, [isLoggedIn, pathname, closeMenu, handleLogout]);

  // Оптимизация с useMemo для логотипа
  const logo = useMemo(
    () => (
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
    ),
    [closeMenu],
  );

  // Оптимизация с useMemo для бургер-меню
  const burgerMenu = useMemo(
    () => (
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
    ),
    [toggleMenu],
  );

  // Оптимизация с useMemo для списка меню - КЛЮЧЕВОЕ ИЗМЕНЕНИЕ
  const menuList = useMemo(
    () => (
      <ul className={styles.menu__list}>
        {menuItems.map((item, index) => (
          <li key={index} className={styles.menu__item}>
            <Link
              href={item.href}
              className={`${styles.menu__link} ${item.isActive ? styles.active : ''}`}
              onClick={(e) => {
                // Для кнопки "Выйти" предотвращаем переход по ссылке
                if (item.label === 'Выйти') {
                  e.preventDefault();
                }
                item.onClick();
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    ),
    [menuItems],
  );

  // Оптимизация с useMemo для оверлея
  const overlay = useMemo(() => {
    if (!isMenuOpen) return null;

    return <div className={styles.menu__overlay} onClick={closeMenu}></div>;
  }, [isMenuOpen, closeMenu]);

  return (
    <nav className={styles.main__nav}>
      {logo}
      {burgerMenu}
      <div
        className={`${styles.nav__menu} ${isMenuOpen ? styles.menu__open : ''}`}
      >
        {menuList}
      </div>
      {overlay}
    </nav>
  );
}
