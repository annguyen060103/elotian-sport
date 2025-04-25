import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from './Button';
import styles from './PrimaryHeader.module.scss';
import { Text } from './Text';
import elotian from '@/assets/images/elotian_black_logo.svg';
import account_logo from '@/assets/icons/account_logo.svg';

export const PrimaryHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/course');
  };

  return (
    <header className={styles.container}>
      <img src={elotian} className={styles.elotian} onClick={handleLogoClick} />
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
          to="/facility"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('facility')}</Text>
        </NavLink>
      }
      {
        <NavLink
          to="/payment"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('payment')}</Text>
        </NavLink>
      }
      {
        <NavLink
          to="/subscription-plan"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('supcriptionPlan')}</Text>
        </NavLink>
      }
      {
        <NavLink
          to="/my-calendar"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('myCalendar')}</Text>
        </NavLink>
      }
      {
        <NavLink
          to="/main-calendar"
          className={({ isActive, isPending }) =>
            isPending ? '' : isActive ? styles.active : styles.pending
          }
        >
          <Text type="Body 2 Bold">{t('mainCalendar')}</Text>
        </NavLink>
      }

      <div className={styles.accountAndSignOut}>
        <img src={account_logo} className={styles.account} />
        <Button
          title={t('signOut')}
          type="secondary-white"
          onClick={() => navigate('/login')}
        />
      </div>
    </header>
  );
};
