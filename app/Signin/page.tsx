'use client';

import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { authUser } from '../services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    if (!email.includes('@')) {
      return setErrorMessage('Введите корректный email');
    }

    setIsLoading(true);

    try {
      const response = await authUser({ email, password });
      console.log('Авторизация успешна:', response.data);

      // Сохраняем данные пользователя
      const userData = response.data;
      
      // Сохраняем пользователя
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        username: userData.username,
        _id: userData._id
      }));
      
      // Сохраняем токены
      if (userData.tokens) {
        localStorage.setItem('access_token', userData.tokens.access);
        localStorage.setItem('refresh_token', userData.tokens.refresh);
        console.log('Токены сохранены');
      } else {
        console.warn('Токены не получены');
      }

      // Перенаправляем на главную страницу
      router.push('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.log('Ошибка авторизации:', error.response.data);
          console.log('Статус:', error.response.status);

          if (error.response.status === 400) {
            setErrorMessage(
              error.response.data.message ||
                'Некорректные данные для авторизации',
            );
          } else if (error.response.status === 401) {
            setErrorMessage(
              error.response.data.message ||
                'Пользователь с таким email или паролем не найден',
            );
          } else if (error.response.status === 500) {
            setErrorMessage('Ошибка сервера. Попробуйте позже.');
          } else {
            setErrorMessage(
              error.response.data.message || 'Ошибка при авторизации',
            );
          }
        } else if (error.request) {
          console.log('Нет ответа от сервера:', error.request);
          setErrorMessage(
            'Отсутствует соединение с сервером. Попробуйте позже.',
          );
        } else {
          console.log('Ошибка настройки:', error.message);
          setErrorMessage('Неизвестная ошибка. Свяжитесь с поддержкой.');
        }
      } else {
        console.log('Неожиданная ошибка:', error);
        setErrorMessage('Неизвестная ошибка. Попробуйте еще раз.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <Link href="/">
              <div className={styles.modal__logo}>
                <Image
                  src="/img/logo_modal.png"
                  alt="logo"
                  width={113}
                  height={17}
                />
              </div>
            </Link>
            <input
              className={classNames(styles.modal__input, styles.login)}
              type="email"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={onChangeEmail}
              disabled={isLoading}
            />
            <input
              className={classNames(styles.modal__input)}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={onChangePassword}
              disabled={isLoading}
            />
            <div className={styles.errorContainer}>
              {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}
            </div>
            <button
              disabled={isLoading}
              onClick={onSubmit}
              className={styles.modal__btnEnter}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
            <Link href="/SignUp" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}