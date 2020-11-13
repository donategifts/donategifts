$(document).ready(function () {

  $(".signup").submit(function (e) {

    e.preventDefault();

    var fName = $("#fName").val();
    var lName = $("#lName").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var userRole = $("input[type='radio']:checked").val();

    $.ajax({
      type: "POST",
      url:  "/users/signup",
      data: {
        fName: fName,
        lName: lName,
        email: email,
        password: password,
        userRole: userRole
      },
      statusCode: {
        409: function(responseObject, textStatus, jqXHR) {
          alert(responseObject.responseText);
          $("#email").val("");
          $("#password").val("");
        },
        200: function(responseObject, textStatus, errorThrown) {
          location.replace(responseObject);
        }           
      }
    });

  });

});