import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationES from './locales/es-ES.json';
import translationEN from './locales/en-GB.json';

const resources = {
  'es-ES': {
    translation: translationES
  },
  'en-GB': {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es-ES', // idioma por defecto
    fallbackLng: 'en-GB',
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    }
  });

export default i18n;
