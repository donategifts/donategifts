$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/wishcards/get/random',
    success: function (html) {
      $('.wishcards').replaceWith(html);
    },
    error: function (response) {
      alert('Cards could not be retrieved');
    },
  });
});
