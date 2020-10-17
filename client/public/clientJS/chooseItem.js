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

  $('#wishCardFormGuided').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var formdata = new FormData(form[0]);
    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: '/wishcards/guided/',
      data: formdata,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
      statusCode: {
        200: function (route) {
          $('#wishCardFormGuided')[0].reset();
          showToast('WishCard Created!');
          setTimeout(() => location.assign(route), 2000);
        },
        400: function (response) {
          let txtToJson = JSON.parse(response.responseText);
          showToast(txtToJson.error);
        },
      },
    });
  });
});
