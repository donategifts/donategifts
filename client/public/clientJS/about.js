$(function () {
  $('#emailForm').submit(function (e) {
    e.preventDefault();

    var formData = $(this)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    console.log(formData);

    $.ajax({
      type: 'POST',
      url: '/about/customer-service',
      data: formData,
      success: function () {
        showToast('Message sent, thank you for your feedback!');
        $('#emailForm').each(function () {
          this.reset();
        });
      },
      error: function (response) {
        let txtToJson = JSON.parse(response.responseText);
        let errorMsg = txtToJson.error;
        showToast(errorMsg.msg);
      },
    });
  });
});
