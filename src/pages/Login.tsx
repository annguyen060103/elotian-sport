// src/pages/Login.tsx
import React from 'react';
import styles from './Login.module.scss';
import { message, Form, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import elotian_green_logo from '@/assets/images/elotian_green_logo.svg';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<LoginFormData>();

  const onFinish = (values: Record<string, string>) => {
    console.log('Success:', values);
    message.success(`Welcome, ${values.username}!`);
  };

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Login failed. Please check your input.');
  };

  return (
    <div className={styles.container}>
      <img
        src={elotian_green_logo}
        alt="elotian_green_logo"
        className={styles.elotian}
      />
      <Form
        layout="vertical"
        onFinish={handleSubmit(onFinish)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
        <div className={styles.forgot}>
          <a href="/forgot-password">{t('forgotPassword')}</a>
        </div>
        <Button
          title={t('login')}
          className={styles.signIn}
          onClick={handleSubmit(onFinish)}
        />{' '}
      </Form>
    </div>
  );
};
