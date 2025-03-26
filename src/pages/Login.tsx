import React, { useEffect, useState } from 'react';
import styles from './Login.module.scss';
import { message, Form, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import elotian_green_logo from '@/assets/images/elotian_green_logo.svg';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
// import api from '@/api/posts';
import axios from 'axios';

type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);

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

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get('/posts');
  //       setPosts(response.data);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else {
  //         console.log(`Error: ${error.message}`);
  //       }
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  const data = JSON.stringify({
    username: 'admin',
    password: 'admin',
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://gym-crm.lehaitien.site/auth/token',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

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
