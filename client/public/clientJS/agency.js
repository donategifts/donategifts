$(document).ready(function () {
  $('.signup-agency').submit(function (e) {
    e.preventDefault();
    $('#submit-btn').prop('disabled', true);

    let agencyName = $('#agencyName').val();
    let agencyWebsite = $('#agencyWebsite').val();
    let agencyPhone = $('#agencyPhone').val();
    let agencyBio = $('#agencyBio').val();
    let address1 = $('#agencyAddress1').val();
    let address2 = $('#agencyAddress2').val();
    let city = $('#city').val();
    let state = $('#state').val();
    let country = $('#country').val();
    let zipcode = $('#zipcode').val();
    $.ajax({
      type: 'POST',
      url: '/users/agency',
      data: {
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio,
        agencyAddress: {
            address1,
            address2,
            city,
            state,
            country,
            zipcode
        }
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
