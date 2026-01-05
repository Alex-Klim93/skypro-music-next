'use client';

import styles from './signup.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/services/auth/authApi';
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
    setErrorMessage('');
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage('');
  };

  const generateUsername = (email: string): string => {
    const baseUsername = email.split('@')[0];
    const timestamp = Date.now().toString().slice(-6);
    return `${baseUsername}${timestamp}`;
  };

  // Функция для проверки формата email
  const validateEmailFormat = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Введите корректный email адрес';
    }
    return null;
  };

  // Функция для проверки заполнения всех полей
  const validateAllFieldsFilled = (): string | null => {
    const fields = [
      { value: email, name: 'Почта' },
      { value: password, name: 'Пароль' },
      { value: confirmPassword, name: 'Повторите пароль' },
    ];

    const emptyFields = fields
      .filter((field) => !field.value.trim())
      .map((field) => field.name);

    if (emptyFields.length > 0) {
      return `Заполните все поля: ${emptyFields.join(', ')}`;
    }

    return null;
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Проверка заполнения всех полей
    const fieldsFilledError = validateAllFieldsFilled();
    if (fieldsFilledError) {
      return setErrorMessage(fieldsFilledError);
    }

    // 2. Проверка формата почты
    const emailFormatError = validateEmailFormat(email);
    if (emailFormatError) {
      return setErrorMessage(emailFormatError);
    }

    // 3. Проверка совпадения паролей
    if (password !== confirmPassword) {
      return setErrorMessage('Пароли не совпадают');
    }

    // 4. Отправка на сервер для остальных проверок
    setIsLoading(true);

    try {
      const username = generateUsername(email);

      const response = await registerUser({
        email,
        password,
        username,
      });

      router.push('/page/Signin');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const serverError = error.response.data;

          // Получаем сообщение об ошибке с сервера
          if (typeof serverError === 'object' && serverError !== null) {
            if ('message' in serverError && serverError.message) {
              setErrorMessage(String(serverError.message));
            } else if ('detail' in serverError && serverError.detail) {
              setErrorMessage(String(serverError.detail));
            } else if ('email' in serverError && serverError.email) {
              setErrorMessage(
                Array.isArray(serverError.email)
                  ? serverError.email.join(', ')
                  : String(serverError.email),
              );
            } else if ('password' in serverError && serverError.password) {
              setErrorMessage(
                Array.isArray(serverError.password)
                  ? serverError.password.join(', ')
                  : String(serverError.password),
              );
            } else {
              // Пробуем найти первую текстовую ошибку в ответе
              const errorValues = Object.values(serverError);
              const firstError = errorValues.find(
                (val) =>
                  typeof val === 'string' ||
                  (Array.isArray(val) && val.length > 0),
              );

              if (firstError) {
                setErrorMessage(
                  Array.isArray(firstError)
                    ? firstError.join(', ')
                    : String(firstError),
                );
              } else {
                setErrorMessage('Ошибка при регистрации');
              }
            }
          } else if (typeof serverError === 'string') {
            setErrorMessage(serverError);
          } else {
            // Стандартные сообщения по статусу
            if (error.response.status === 400) {
              setErrorMessage('Некорректные данные для регистрации');
            } else if (error.response.status === 403) {
              setErrorMessage('Пользователь с таким email уже существует');
            } else if (error.response.status === 500) {
              setErrorMessage('Ошибка сервера. Попробуйте позже.');
            } else {
              setErrorMessage('Ошибка при регистрации');
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <Link href="/page/Signin">
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
              autoComplete="email"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={onChangePassword}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
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
