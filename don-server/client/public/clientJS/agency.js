$(document).ready(function () {
  $('.signup-agency').submit(function (e) {
    e.preventDefault();
    $('#submit-btn').prop('disabled', true);

    let agencyName = $('#agencyName').val();
    let agencyWebsite = $('#agencyWebsite').val();
    let agencyPhone = $('#agencyPhone').val();
    let agencyBio = $('#agencyBio').val();

    $.ajax({
      type: 'POST',
      url: '/users/agency',
      data: {
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio,
      },
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
