import './styles/index.scss';
import 'bootstrap';

// Inline the text translations in this variable:
import locales from "./locales.json";
// Get current language for this page:
var currentLang = document.documentElement.lang || DEFAULT_LANG;

// As usual with my projects, I'm using JQuery very sparingly so I'd have
// less work to do if I were to completely ditch it.
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
}