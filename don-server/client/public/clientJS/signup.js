$(document).ready(function () {
  $('.signup').submit(function (e) {
    e.preventDefault();
    $('#submit-btn').prop('disabled', true);
    grecaptcha.execute();
    return;
  });
});

// check if password1 is the same as password 2
window.onload = function () {
  let password2Element = document.getElementById('password2');
  password2Element.onblur = function () {
    let passwordElement = document.getElementById('password');
    if (password2Element.value !== passwordElement.value) {
      password2Element.setCustomValidity("Passwords don't match");
    } else {
      password2Element.setCustomValidity('');
    }
  };
};

let confirmCaptchaSubmit = function (response) {
  let captchaToken = response;
  let fName = $('#fName').val();
  let lName = $('#lName').val();
  let email = $('#email').val();
  let password = $('#password').val();
  let passwordConfirm = $('#password2').val();
  let userRole = $("input[type='radio']:checked").val();
  $.ajax({
    type: 'POST',
    url: '/users/signup',
    data: {
      fName: fName,
      lName: lName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      userRole: userRole,
      captchaToken: captchaToken,
    },
    success: function (response, textStatus, xhr) {
      $('#submit-btn').prop('disabled', false);
      location.assign(response.url);
    },
    error: function (response, textStatus, errorThrown) {
      $('#submit-btn').prop('disabled', false);
      showToast(response.responseJSON.error.msg);
      grecaptcha.reset();
    },
  });
};

window.confirmCaptchaSubmit = confirmCaptchaSubmit;
