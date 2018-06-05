//import * as fs from 'fs';

export default function (lang, name) {
  let tpl = require('../partials/blocks/' + name + '_' + lang + '.hbs');
  // The current template context is supposed to be 'this'.
  return tpl(this);
}