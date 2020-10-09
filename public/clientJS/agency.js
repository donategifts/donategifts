$(document).ready(function () {
  $(".signup-agency").submit(function (e) {
    e.preventDefault();

    let agencyName = $("#agencyName").val();
    let agencyWebsite = $("#agencyWebsite").val();
    let agencyPhone = $("#agencyPhone").val();
    let agencyBio = $("#agencyBio").val();

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
        },
        200: function (responseObject, textStatus, errorThrown) {
          location.replace(responseObject);
        },
      },
    });
  });
});
