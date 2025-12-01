// app/SignUp/page.tsx
'use client';

import styles from './signup.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../services/auth/authApi';
import { AxiosError } from 'axios';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // Функция для генерации username на основе email
  const generateUsername = (email: string): string => {
    const baseUsername = email.split('@')[0];
    // Добавляем timestamp чтобы сделать уникальным
    const timestamp = Date.now().toString().slice(-6);
    return `${baseUsername}${timestamp}`;
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // Валидация
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    if (password !== confirmPassword) {
      return setErrorMessage('Пароли не совпадают');
    }

    if (password.length < 6) {
      return setErrorMessage('Пароль должен содержать минимум 6 символов');
    }

    if (!email.includes('@')) {
      return setErrorMessage('Введите корректный email');
    }

    setIsLoading(true);

    try {
      // Генерируем username автоматически
      const username = generateUsername(email);

      const response = await registerUser({
        email,
        password,
        username, // Добавляем сгенерированный username
      });

      console.log('Регистрация успешна:', response.data);

      // После успешной регистрации перенаправляем на страницу входа
      router.push('/Signin');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.log('Ошибка регистрации:', error.response.data);
          console.log('Статус:', error.response.status);

          if (error.response.status === 400) {
            setErrorMessage(
              error.response.data.message ||
                'Некорректные данные для регистрации',
            );
          } else if (error.response.status === 403) {
            setErrorMessage(
              error.response.data.message ||
                'Пользователь с таким email уже существует',
            );
          } else if (error.response.status === 500) {
            setErrorMessage('Ошибка сервера. Попробуйте позже.');
          } else {
            setErrorMessage(
              error.response.data.message || 'Ошибка при регистрации',
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
            <Link href="/Signin">
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
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={onChangePassword}
              disabled={isLoading}
            />
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
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
              className={styles.modal__btnSignupEnt}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
