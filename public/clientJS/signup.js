$(document).ready(function () {

  $(".signup").submit(function (e) {

    e.preventDefault();

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
      success: function(route, textStatus, xhr) {
        location.replace(route);
      },
      error: function(response, textStatus, errorThrown) {
        let txtToJson =  JSON.parse(response.responseText);
        Toastify({
            text: txtToJson.error,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #8e4dff, #8e4dff)",
            stopOnFocus: true,
        }).showToast();
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
