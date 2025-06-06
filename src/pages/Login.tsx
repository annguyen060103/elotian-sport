import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import elotian_green_logo from '@/assets/images/elotian_green_logo.svg';
import styles from './Login.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/Text';

type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const { t } = useTranslation();
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<LoginFormData>();

  const onSubmit = (values: LoginFormData) => {
    login(values.email, values.password, () => {
      navigate('/course');
    });
  };

  return (
    <div className={styles.container}>
      <img
        src={elotian_green_logo}
        alt="elotian_green_logo"
        className={styles.elotian}
      />
      <Controller
        control={control}
        rules={{ required: t('emailRequired') }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className={styles.emailAndPassword}
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            type="email"
            onClear={() => setValue('email', '')}
            error={errors.email?.message}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{ required: t('passwordRequired') }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className={styles.emailAndPassword}
            label={t('password')}
            placeholder={t('passwordPlaceholder')}
            type="password"
            onClear={() => setValue('password', '')}
            error={errors.password?.message}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        )}
        name="password"
      />

      {error && (
        <Text type="Caption 1 Bold" className={styles.error}>
          {error}
        </Text>
      )}

      <div className={styles.forgot}>
        <a href="/forgot-password">{t('forgotPassword')}</a>
      </div>

      <Button
        title={loading ? t('loggingIn') : t('login')}
        className={styles.signIn}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
      />
    </div>
  );
};
