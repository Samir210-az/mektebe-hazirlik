import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import az from './locales/az/translation.json';
import ru from './locales/ru/translation.json';
import en from './locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: { az: { translation: az }, ru: { translation: ru }, en: { translation: en } },
  lng: localStorage.getItem('lang') || 'az',
  fallbackLng: 'az',
  interpolation: { escapeValue: false }
});

export default i18n;
