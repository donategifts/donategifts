function facebookLogin(fbUser) {
  if (fbUser.authResponse && fbUser.status === 'connected') {
    FB.api('/me', 'GET', { fields: ['name', 'email'] }, function (response) {
      if (response.id) {
        $.ajax({
          type: 'POST',
          url: '/users/fb-signin',
          data: {
            userName: response.name,
            email: response.email,
          },
          success: function (route) {
            location.assign(route.url);
          },
          error: function (response) {
            let txtToJson = JSON.parse(response.responseText);
            showToast(txtToJson.error.msg);
          },
        });
      }
    });
  }
}

function googleLogin(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

  // disconnect to avoid constant re-login after logout
  googleUser.disconnect();

  $.ajax({
    type: 'POST',
    url: '/users/google-signin',
    data: {
      id_token,
    },
    success: function (route) {
      location.assign(route.url);
    },
    error: function (response) {
      showToast(response.responseJSON.error.msg);
    },
  });
}
