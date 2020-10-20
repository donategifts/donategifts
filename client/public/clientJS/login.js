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
            setTimeout(() => location.assign(route.url), 2000);
          },
          error: function (response) {
            let txtToJson = JSON.parse(response.responseText);
            showToast(txtToJson.error);
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
      setTimeout(() => location.assign(route.url), 2000);
    },
    error: function (response) {
      let txtToJson = JSON.parse(response.responseText);
      showToast(txtToJson.error);
    },
  });
}
