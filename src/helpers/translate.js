// JSON doesn't require a loader with Webpack 2+.
import translations from '../locales.json';

export default function (key, short) {
  
  return translations['fr']['contactUs'];
}