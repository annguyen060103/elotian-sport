import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Button } from './Button';
import styles from './PrimaryHeader.module.scss';
import { Text } from './Text';
import elotian_black_logo from '@/assets/images/elotian_black_logo.svg';
import avatar from '@/assets/icons/avatar.svg';

export const PrimaryHeader = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <header className={styles.horizontalHeader}>
        <img
          src={elotian_black_logo}
          alt="elotian_black_logo"
          className={styles.elotian}
        />

        <Text type="Body 1 Bold">{t('elotian')}</Text>

        <div className={styles.adminAndAvatar}>
          <Text type="Body 2 Bold">{t('admin')}</Text>
          <img src={avatar} alt="avatar" className={styles.avatar} />
        </div>
      </header>

      <aside className={styles.container}>
        {
          <NavLink
            to="/course"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('course')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/trainer"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('trainer')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/student"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('student')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/staff"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('staff')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/device"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('device')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/report"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('report')}</Text>
          </NavLink>
        }
        {
          <NavLink
            to="/code"
            className={({ isActive, isPending }) =>
              isPending ? '' : isActive ? styles.active : styles.pending
            }
          >
            <Text type="Body 2 Bold">{t('code')}</Text>
          </NavLink>
        }

        <Button
          title={t('signOut')}
          type="secondary-white"
          className={styles.signOut}
        />
      </aside>
    </div>
  );
};
