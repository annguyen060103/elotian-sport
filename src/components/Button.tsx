import { HTMLProps, ReactNode } from 'react';

import cx from 'classnames';

import styles from './Button.module.scss';
import { Text } from './Text';

type ButtonProps = HTMLProps<HTMLButtonElement> & {
  title: string;
  type?:
    | 'primary'
    | 'primary-black'
    | 'text'
    | 'secondary-white'
    | 'secondary-black'
    | 'outline';
  icon?: ReactNode;
};

export function Button({
  title,
  onClick,
  className,
  type = 'primary',
  icon,
  disabled,
  ...props
}: ButtonProps) {
  if (type === 'primary' || type === 'primary-black') {
    return (
      <button
        className={cx(
          className,
          styles.button,
          styles.primary,
          type === 'primary-black' && styles.primaryBlack,
          icon && styles.withIcon,
          disabled && styles.disabled,
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {icon}
        <Text type="Body 2 Bold" className={styles.buttonText}>
          {title}
        </Text>
      </button>
    );
  }

  if (type === 'secondary-white') {
    return (
      <button
        className={cx(className, styles.button, styles.secondaryWhite)}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {icon}
        <Text type="Body 2 Bold" className={styles.buttonText}>
          {title}
        </Text>
      </button>
    );
  }

  if (type === 'secondary-black') {
    return (
      <button
        className={cx(
          className,
          styles.button,
          styles.secondaryBlack,
          icon && styles.withIcon,
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {icon}
        <Text type="Body 2 Bold" className={styles.buttonText}>
          {title}
        </Text>
      </button>
    );
  }

  if (type === 'text') {
    return (
      <button
        className={cx(
          className,
          styles.button,
          styles.text,
          icon && styles.withIcon,
        )}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {icon}
        <Text type="Body 2 Bold">{title}</Text>
      </button>
    );
  }

  if (type === 'outline') {
    return (
      <button
        className={cx(
          className,
          styles.button,
          styles.text,
          styles.outline,
          icon && title && styles.withIcon,
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {icon}
        <Text type="Body 2 Bold">{title}</Text>
      </button>
    );
  }
}
