'use client';

import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState, useCallback, useMemo } from 'react';
import { authUser } from '../services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store/store';
import { setUser, setTokens } from '../services/auth/authSlice';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Оптимизация с useCallback
  const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  // Валидация email с useMemo
  const isEmailValid = useMemo(() => {
    return email.includes('@');
  }, [email]);

  // Валидация формы с useMemo
  const isFormValid = useMemo(() => {
    return email.trim() !== '' && password.trim() !== '' && isEmailValid;
  }, [email, password, isEmailValid]);

  // Оптимизация с useCallback для сабмита
  const onSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setErrorMessage('');

      if (!email.trim() || !password.trim()) {
        return setErrorMessage('Заполните все поля');
      }

      if (!isEmailValid) {
        return setErrorMessage('Введите корректный email');
      }

      setIsLoading(true);

      try {
        const response = await authUser({ email, password });
        console.log('Авторизация успешна:', response.data);

        // Сохраняем данные пользователя
        const userData = response.data;

        // Сохраняем пользователя в Redux и localStorage
        const userInfo = {
          email: userData.email,
          username: userData.username || email.split('@')[0],
          _id: userData._id,
        };

        dispatch(setUser(userInfo));

        // Сохраняем токены в Redux и localStorage
        if (userData.tokens) {
          dispatch(
            setTokens({
              access: userData.tokens.access,
              refresh: userData.tokens.refresh,
            }),
          );
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
    },
    [email, password, isEmailValid, router, dispatch],
  );

  // Оптимизация с useMemo для error message
  const errorContent = useMemo(() => {
    if (!errorMessage) return null;

    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{errorMessage}</div>
      </div>
    );
  }, [errorMessage]);

  // Оптимизация с useMemo для кнопки
  const buttonContent = useMemo(() => {
    return (
      <button
        disabled={isLoading || !isFormValid}
        onClick={onSubmit}
        className={styles.modal__btnEnter}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    );
  }, [isLoading, isFormValid, onSubmit]);

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
                  priority // Оптимизация загрузки изображения
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
              aria-label="Email"
            />
            <input
              className={classNames(styles.modal__input)}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={onChangePassword}
              disabled={isLoading}
              aria-label="Password"
            />
            {errorContent}
            {buttonContent}
            <Link href="/SignUp" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
