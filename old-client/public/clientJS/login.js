$(document).ready(function () {
  $('.signup').submit(function (e) {
    e.preventDefault();
    $('#submit-btn').prop('disabled', true);

    const formData = $(this)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    $.ajax({
      type: 'POST',
      url: '/users/login',
      data: formData,
      success: function (response, textStatus, jqXHR) {
        $('#submit-btn').prop('disabled', false);
        location.assign(response.url);
      },
      error: function (response, textStatus, errorThrown) {
        showToast(response.responseJSON.error.msg);
        $('#submit-btn').prop('disabled', false);
      },
    });
  });
});
