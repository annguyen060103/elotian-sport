import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import EN from './en.json';

export enum Language {
  EN = 'en',
}
export enum Locale {
  EN_US = 'en-US',
}

export const SUPPORT_LANGUAGES: string[] = [Language.EN];
export const LOCALE_BY_LANGUAGE = {
  [Language.EN]: Locale.EN_US,
};
export const CURRENCY_BY_LOCALE: Record<string, string> = {
  [Locale.EN_US]: 'USD',
};

export const DEFAULT_LANGUAGE = Language.EN;

i18n.use(initReactI18next).init({
  resources: {
    [Language.EN]: { translation: EN },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: Language.EN,
  compatibilityJSON: 'v4',
});

export default i18n;
