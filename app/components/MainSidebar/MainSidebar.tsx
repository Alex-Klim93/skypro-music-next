'use client';

import Link from 'next/link';
import SidebarBlock from '../SidebarBlock/SidebarBlock';
import styles from './MainSidebar.module.css';
import { useEffect, useState } from 'react';
import { logoutUser } from '@/app/services/auth/authApi';

interface UserData {
  email: string;
  username: string;
  _id: number;
}

export default function MainSidebar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser: UserData = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
      }
    }

    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      await logoutUser(refreshToken);
    } catch (error) {
      console.log('Ошибка при выходе:', error);
    }

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        {isLoading ? (
          <p className={styles.sidebar__personalName}>Загрузка...</p>
        ) : user ? (
          <p className={styles.sidebar__personalName}>
            {user.username || user.email.split('@')[0]}
          </p>
        ) : (
          <p className={styles.sidebar__personalName}>Гость</p>
        )}
        <Link
          className={styles.sidebar__icon}
          href={user ? '#' : '/Signin'}
          onClick={user ? handleLogout : undefined}
        >
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </Link>
      </div>
      <SidebarBlock />
    </div>
  );
}
