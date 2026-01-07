import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './plugins/i18n/language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'eng',
    supportedLngs: ['eng', 'ru', 'uz'],
    interpolation: {
      escapeValue: false
    },
    resources: resources
  });

export default i18n;
