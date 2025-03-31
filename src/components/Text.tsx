import cx from 'classnames';

import styles from './Text.module.scss';

export type TextType =
  | 'Caption 1 Medium'
  | 'Caption 2 Regular'
  | 'Caption 2 Bold'
  | 'Caption 1 Bold'
  | 'Body 2 Regular'
  | 'Body 2 Medium'
  | 'Body 2 Bold'
  | 'Body 1 Regular'
  | 'Body 1 Medium'
  | 'Body 0 Regular'
  | 'Body 1 Bold'
  | 'Headline 5'
  | 'Headline 4'
  | 'Headline 3'
  | 'Headline 2'
  | 'Headline 1'
  | 'Big Title 1';

type TextProps = {
  children: React.ReactNode;
  className?: string;
  type: TextType;
};

const typeToClassMap: Record<TextType, string> = {
  'Caption 1 Medium': styles.caption1Medium,
  'Caption 2 Regular': styles.caption2Regular,
  'Caption 2 Bold': styles.caption2Bold,
  'Caption 1 Bold': styles.caption1Bold,
  'Body 2 Regular': styles.body2Regular,
  'Body 2 Medium': styles.body2Medium,
  'Body 2 Bold': styles.body2Bold,
  'Body 1 Regular': styles.body1Regular,
  'Body 1 Medium': styles.body1Medium,
  'Body 0 Regular': styles.body0Regular,
  'Body 1 Bold': styles.body1Bold,
  'Headline 5': styles.headline5,
  'Headline 4': styles.headline4,
  'Headline 3': styles.headline3,
  'Headline 2': styles.headline2,
  'Headline 1': styles.headline1,
  'Big Title 1': styles.bigTitle1,
};

export function Text({ children, className, type }: TextProps) {
  return (
    <span className={cx(typeToClassMap[type], className)}>{children}</span>
  );
}
