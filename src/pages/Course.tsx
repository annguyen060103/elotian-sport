import { useTranslation } from 'react-i18next';
import styles from './Course.module.scss';
import { Text } from '@/components/Text';

export const Course = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1"> {t('courseManagement')}</Text>
        </span>
      </div>
    </div>
  );
};
