import './styles/index.scss';
import 'bootstrap';

// Inline the text translations in this variable:
import locales from "./locales.json";
// Get current language for this page (DEFAULT_LANG is injected by Webpack):
var currentLang = document.documentElement.lang || DEFAULT_LANG;

// Register the language picker:
var reg = /\/\w{2}\/([a-zA-Z0-9\.]+)$/;
var lgLinks = document.querySelectorAll('[data-lang]');
for (var i = 0; i < lgLinks.length; i++) {
  lgLinks[i].addEventListener('click', function() {
    console.log(this.getAttribute('data-lang'));
    var matches = reg.exec(window.location.href);
    if (matches) {
      window.location.href = window.location.protocol + '//' +
        window.location.host + '/' + this.getAttribute('data-lang') + 
        '/' + matches[1];
    } else {
      window.location.href = window.location.protocol + '//' + 
        window.location.host + '/' + this.getAttribute('data-lang') + '/'; 
    }
  });
}

// As usual with my projects, I'm using JQuery very sparingly so I'd have
// less work to do if I were to completely ditch it.
// This is really weird, do not do this please.
if (document.getElementById('contactForm')) {
  // We're on the contact page.
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var spinner = document.getElementById('contactSpinner');
    spinner.classList.remove('d-none');
    // Send the request:
    var data = {
      email: document.getElementById('emailInput').value,
      name: document.getElementById('nameInput').value,
      subject: document.getElementById('subjectInput').value,
      category: document.getElementById('categorySelect').value,
      message: document.getElementById('messageInput').value
    };
    var modalText = document.getElementById('modalText');
    $.post('http://old.lamusiquedelagarde.be/terrible_contact_from.php', data, function(response) {
      // Success callback:
      modalText.innerHTML = locales[currentLang].emailSent;
      $('#modal').modal('show');
    }, 'json').fail(function() {
      modalText.innerHTML = locales[currentLang].emailError;
      $('#modal').modal('show');
    }).always(function() {
      spinner.classList.add('d-none');
      e.target.reset();
    });
  });
} else if (document.getElementById('scrollDownLink')) {
  // Only the index page has a scroll down link.
  // We'll have to write this diffrently if we're to add more animated scrolling
  // down links.
  document.getElementById('scrollDownLink').addEventListener('click', function() {
    // Scroll with JQuery for their animation effect:
    $('html, body').animate({
      scrollTop: $("#firstSection").offset().top
    }, 500);
  });
}