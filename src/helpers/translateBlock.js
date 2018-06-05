import * as fs from 'fs';

export default function (lang, name) {
  let tpl = fs.readFileSync('./src/partials/blocks/test.hbs', 'utf8');
  //let tpl = require('../partials/blocks/' + name + '.hbs');
  return tpl || 'TranslationMissing';
}