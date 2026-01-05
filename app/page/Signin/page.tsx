'use client';

import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState, useCallback, useMemo } from 'react';
import { authUser } from '@/app/services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/store';
import { setUser, setTokens } from '@/app/services/auth/authSlice';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(''); // Сбрасываем ошибку при изменении поля
  }, []);

  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(''); // Сбрасываем ошибку при изменении поля
  }, []);

  const isFormValid = useMemo(() => {
    return email.trim() !== '' && password.trim() !== '';
  }, [email, password]);

  const onSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setErrorMessage('');

      if (!email.trim() || !password.trim()) {
        return setErrorMessage('Заполните все поля');
      }

      setIsLoading(true);

      try {
        const response = await authUser({ email, password });

        const userData = response.data;

        const userInfo = {
          email: userData.email,
          username: userData.username || email.split('@')[0],
          _id: userData._id,
        };

        dispatch(setUser(userInfo));

        if (userData.tokens) {
          dispatch(
            setTokens({
              access: userData.tokens.access,
              refresh: userData.tokens.refresh,
            }),
          );
        } else {
          console.warn('Токены не получены');
        }

        router.push('/');
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response) {
            // Получаем сообщение об ошибке с сервера
            const serverError = error.response.data;

            // Если сервер вернул объект с сообщением
            if (typeof serverError === 'object' && serverError !== null) {
              if ('message' in serverError && serverError.message) {
                setErrorMessage(String(serverError.message));
              } else if ('detail' in serverError && serverError.detail) {
                setErrorMessage(String(serverError.detail));
              } else {
                // Пробуем найти любое текстовое поле в ответе
                const errorText = Object.values(serverError).find(
                  (val) => typeof val === 'string',
                );
                setErrorMessage(
                  errorText ? String(errorText) : 'Ошибка при авторизации',
                );
              }
            } else if (typeof serverError === 'string') {
              setErrorMessage(serverError);
            } else {
              // Стандартные сообщения по статусу
              if (error.response.status === 400) {
                setErrorMessage('Некорректные данные для авторизации');
              } else if (error.response.status === 401) {
                setErrorMessage('Неверный email или пароль');
              } else if (error.response.status === 500) {
                setErrorMessage('Ошибка сервера. Попробуйте позже.');
              } else {
                setErrorMessage('Ошибка при авторизации');
              }
            }
          } else if (error.request) {
            setErrorMessage(
              'Отсутствует соединение с сервером. Попробуйте позже.',
            );
          } else {
            setErrorMessage('Неизвестная ошибка. Свяжитесь с поддержкой.');
          }
        } else {
          setErrorMessage('Неизвестная ошибка. Попробуйте еще раз.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router, dispatch],
  );

  const errorContent = useMemo(() => {
    if (!errorMessage) return null;

    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{errorMessage}</div>
      </div>
    );
  }, [errorMessage]);

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
                  priority
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
              autoComplete="email"
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
              autoComplete="current-password"
            />
            {errorContent}
            {buttonContent}
            <Link href="/page/SignUp" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
