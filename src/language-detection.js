
var userLang = navigator.language || navigator.userLanguage;
if (userLang.indexOf('en') >= 0) {
  // Redirect. Using location.replace won't put something
  // in the browser history. We might want to, though.
  window.location.replace('/en');
}