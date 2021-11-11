$(document).ready(function () {
  let deleteBtns = $('wishCardDeleteBtn');

  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', function (e) {
      e.preventDefault();

      $.ajax({
      type: 'DELETE',
      url: `/wishcards/delete/${e.target.value}`,
      timeout: 600000,
      statusCode: {
        200: function (response) {
          showToast('WishCard Deleted!');
          setTimeout(() => location.assign(response.url), 2000);
        },
        400: function (response) {
          showToast(response.responseJSON.error.msg);
        },
        403: function (responseObject) {
          showToast('Access Forbidden: Your account lacks sufficient permissions');
          let { url } = responseObject.responseJSON;
          setTimeout(() => location.assign(url), 1200);
        },
      },
    });
    });
  }
})