import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en/translation.json';
import ko from './locales/ko/translation.json';

// Detect user language
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Use browser's language detector
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      ko: {
        translation: ko,
      },
    },
    fallbackLng: 'en', // Default language if user's language isn't available
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
