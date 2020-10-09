$(document).ready(function () {
  $(".signup-agency").submit(function (e) {
    e.preventDefault();
    $("#submit-btn").prop("disabled",true);

    var agencyName = $("#agencyName").val();
    var agencyWebsite = $("#agencyWebsite").val();
    var agencyPhone = $("#agencyPhone").val();
    var agencyBio = $("#agencyBio").val();

    $.ajax({
      type: "POST",
      url: "/users/agency",
      data: {
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio,
      },
      statusCode: {
        409: function (responseObject, textStatus, jqXHR) {
          showToast(responseObject.responseText);
          $("#submit-btn").prop("disabled",false);

        },
        200: function (responseObject, textStatus, errorThrown) {
          location.replace(responseObject);
          $("#submit-btn").prop("disabled",false);

        },
      },
    });
  });
});
