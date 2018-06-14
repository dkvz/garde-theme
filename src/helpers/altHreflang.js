import { conf } from '../../config-options.js';

export default function (lang, page) {
  let tags = '';  
  conf.languages.forEach((e) => {
    if (e !== lang) {
      tags += `<link rel="alternate" hreflang="${e}" href="${conf.absoluteUrl}/${e}/${page}.html" />`;
    }
  });
  return tags;
}