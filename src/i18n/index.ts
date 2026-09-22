import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import esCommon from '../locales/es/common.json'
import enCommon from '../locales/en/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    defaultNS: 'common',
    resources: {
      es: { common: esCommon },
      en: { common: enCommon },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      // Seguro hoy porque las traducciones solo se renderizan como children de React
      // (que escapa por defecto) y no se usa <Trans> ni dangerouslySetInnerHTML.
      // Si se agrega cualquiera de los dos, volver a evaluar esta bandera.
      escapeValue: false,
    },
  })

export default i18n
