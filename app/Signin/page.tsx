import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

export default function Signin() {
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
              type="text"
              name="login"
              placeholder="Почта"
            />
            <input
              className={classNames(styles.modal__input)}
              type="password"
              name="password"
              placeholder="Пароль"
            />
            <div className={styles.errorContainer}>{/*Блок для ошибок*/}</div>
            <button className={styles.modal__btnEnter}>Войти</button>
            <Link href="/SignUp" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
