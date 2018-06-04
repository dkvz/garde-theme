// JSON doesn't require a loader with Webpack 2+.
import translations from '../locales.json';

export default function (lang, key) {
  return translations[lang][key] || 'TranslationMissing';
}