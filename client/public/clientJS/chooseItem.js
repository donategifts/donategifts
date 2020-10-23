$(document).ready(function () {
  let ageCategory = $('#ageGroupSelector').val();

  $.ajax({
    type: 'GET',
    url: `/wishcards/defaults/${ageCategory}`,
    statusCode: {
      200: function (responseObject) {
        let { html } = responseObject;
        $('.choicesContainer').replaceWith(html);
      },
      403: function (responseObject) {
        showToast('Access Forbidden: Your account lacks sufficient permissions');
        let { url } = responseObject.responseJSON;
        setTimeout(() => location.assign(url), 1200);
      },
    },
  });

  $('#ageGroupSelector').change(function () {
    let ageCategory = $('#ageGroupSelector').val();
    $.ajax({
      type: 'GET',
      url: `/wishcards/defaults/${ageCategory}`,
      success: function (responseObject) {
        let { html } = responseObject;
        $('.choicesContainer').replaceWith(html);
      },
      error: function (response) {
        showToast('Images could not be retrieved');
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
        200: function (response) {
          $('#wishCardFormGuided')[0].reset();
          showToast('WishCard Created!');
          setTimeout(() => location.assign(response.url), 2000);
        },
        400: function (responseObject) {
          let { error } = responseObject.responseJSON;
          let { msg } = error;
          showToast(msg);
        },
        403: function (responseObject) {
          showToast('Access Forbidden: Your account lacks sufficient permissions');
          let { url } = responseObject.responseJSON;
          setTimeout(() => location.assign(url), 1200);
        },
      },
    });
  });
});
