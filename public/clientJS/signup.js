$(document).ready(function () {

  $(".signup").submit(function (e) {

    e.preventDefault();
    $("#submit-btn").prop("disabled",true);

    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let passwordConfirm = $("#password2").val();
    let userRole = $("input[type='radio']:checked").val();

    $.ajax({
      type: "POST",
      url:  "/users/signup",
      data: {
        fName: fName,
        lName: lName,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        userRole: userRole
      },
      success: function(response, textStatus, xhr) {
        $("#submit-btn").prop("disabled",false);
      
        showToast("Please check your mails for a verification email");
        console.log(response.email)
        setTimeout(function(){ window.location = "/users/login" }, response.dev?15000:3000);

      },
      error: function(response, textStatus, errorThrown) {
        let txtToJson =  JSON.parse(response.responseText);
        showToast(txtToJson.error);
        $("#submit-btn").prop("disabled",false);

      }
    });
})
});

// check if password1 is the same as password 2
window.onload = function() {
    let password2Element = document.getElementById("password2");

    password2Element.onblur = function() {
        let passwordElement = document.getElementById("password");
        if (password2Element.value !== passwordElement.value) {
            password2Element.setCustomValidity("Passwords Don't Match");
        } else {
            password2Element.setCustomValidity('');
        }
    }
}
