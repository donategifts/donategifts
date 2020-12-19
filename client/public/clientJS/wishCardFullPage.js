$(document).ready(function () {
  $('.message').submit(function (e) {
    e.preventDefault();

    let message = $('.custom-select option:selected').text();

    $.ajax({
      type: 'POST',
      url: '/wishcards/message',
      data: {
        messageFrom: JSON.parse(messageFrom),
        messageTo: JSON.parse(messageTo),
        message,
      },
      statusCode: {
        400: function (response, textStatus, jqXHR) {
          showToast(response.responseJSON.error.msg);
        },
        200: function (responseObject, textStatus, errorThrown) {
          window.location.reload();
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
