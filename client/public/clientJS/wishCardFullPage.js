$(document).ready(function () {
  $(".message").submit(function (e) {
    e.preventDefault();

    let message = $(".custom-select option:selected").text();

    $.ajax({
      type: "POST",
      url: "/wishcards/message",
      data: {
        messageFrom: JSON.parse(messageFrom),
        messageTo: JSON.parse(messageTo),
        message,
      },
      statusCode: {
        400: function (responseObject, textStatus, jqXHR) {
          alert(responseObject.responseText);
        },
        200: function (responseObject, textStatus, errorThrown) {
          window.location.reload();
        },
      },
    });
  });
});
