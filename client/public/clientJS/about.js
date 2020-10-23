$(function () {
  $('#emailForm').submit(function (e) {
    e.preventDefault();

    var formData = $(this)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    $.ajax({
      type: 'POST',
      url: '/about/customer-service',
      data: formData,
      success: function () {
        showToast('Message sent, thank you for your feedback!', true);
        $('#emailForm').each(function () {
          this.reset();
        });
      },
      error: function (response) {
        showToast(response.responseJSON.error);
      },
    });
  });
});
