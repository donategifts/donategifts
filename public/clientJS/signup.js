$(document).ready(function () {

    $(".signup").submit(function (e) {
  
      e.preventDefault();
  
      var fName = $("#fName").val();
      var lName = $("#lName").val();
      var email = $("#email").val();
      var password = $("#password").val();
      var userRole = $("input[type='radio']:checked").val();
  
      $.post("/users/signup", {
        fName: fName,
        lName: lName,
        email: email,
        password: password,
        userRole: userRole
      }, function(data, status, jqXHR) {
          location.replace(data.redirectUrl);
      });
    
    });
});