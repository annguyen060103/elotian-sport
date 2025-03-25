import { HTMLProps, useState } from 'react';

import cx from 'classnames';
import 'react-markdown-editor-lite/lib/index.css';

import styles from './Input.module.scss';
import { Text } from './Text';

import Clear from '@/assets/icons/times-circle-solid.png';

type InputProps = HTMLProps<HTMLInputElement> & {
  label?: string;
  error?: string;
  name?: string;
  onClear?: () => void;
  onBlur?: () => void;
};

export const Input = ({
  className,
  label,
  error,
  value,
  onClear,
  onBlur,
  ...restProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cx(styles.container, className)}>
      {label && <Text type="Body 2 Medium">{label}</Text>}
      <div
        className={cx(
          styles.inputWrapper,
          error !== undefined
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.border,
        )}
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          value={value}
          {...restProps}
        />
        {Boolean(value) && onClear && <img src={Clear} onClick={onClear} />}
      </div>
      {error && (
        <Text type="Caption 1 Bold" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
};
