import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Button } from './Button';
import styles from './PrimaryHeader.module.scss';
import { Text } from './Text';
import elotian from '@/assets/images/elotian_black_logo.svg';
import account_logo from '@/assets/icons/account_logo.svg';

export const PrimaryHeader = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.container}>
      <img src={elotian} className={styles.elotian} />
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
          to="/equipment"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('equipment')}</Text>
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
          to="/token"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('token')}</Text>
        </NavLink>
      }

      <div className={styles.accountAndSignOut}>
        <img src={account_logo} className={styles.account} />
        <Button title={t('signOut')} type="secondary-white" />
      </div>
    </header>
  );
};
