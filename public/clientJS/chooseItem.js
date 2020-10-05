$(document).ready(function () {
  let ageCategory = $('#ageGroupSelector').val();

  $.ajax({
    type: 'GET',
    url: `/wishcards/defaults/${ageCategory}`,
    success: function (html) {
      $('.choicesContainer').replaceWith(html);
    },
    error: function (response) {
      alert('Images could not be retrieved');
    },
  });

  $('#ageGroupSelector').change(function () {
    let ageCategory = $('#ageGroupSelector').val();
    $.ajax({
      type: 'GET',
      url: `/wishcards/defaults/${ageCategory}`,
      success: function (html) {
        $('.choicesContainer').replaceWith(html);
      },
      error: function (response) {
        alert('Images could not be retrieved');
      },
    });
  });
});
