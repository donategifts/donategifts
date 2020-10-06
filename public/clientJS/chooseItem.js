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

  $('#wishCardForm').on('submit', function (e) {
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
      success: function () {
        showToast('WishCard Created!');
      },
      error: function (response, textStatus, errorThrown) {
        let txtToJson = JSON.parse(response.responseText);
        showToast(txtToJson.error);
      },
    });
  });
});
