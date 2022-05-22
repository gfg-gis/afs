import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import viTranslation from "./locales/vi.json";
import enTranslation from "./locales/en.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
.use(LanguageDetector)
.use(initReactI18next)
.init({  resources: {
    en: {
      translation: enTranslation
    }, 
    vi: {
      translation: viTranslation
    }
  },
  fallbackLng: "en",
  detection: {
    // order: ["cookie", "localStorage", "queryString", "path", "htmlTag"],
    caches: ["cookie", "localStorage"],
  },
  react: {
    useSuspense: false,
  },
  
  interpolation: {
    escapeValue: false
  }, 
}); 

export default i18next;
