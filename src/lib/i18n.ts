import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translations
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const resources = {
  pt: {
    translation: pt,
  },
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale?.split('-')[0] || 'pt', // Get language code from locale with fallback
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
