let msg = "<div class='loginToastReminder'>More features will be enabled if you log in. <span class='link'><a href=\"/users/signup\">Sign Up</a></span> or <span class='link'><a href=\"/users/login\">Login</a></span></div>"

$(window).on('load', function() {
  setTimeout(function() {
    showToast(msg, undefined, -1, {x:0, y:'7em'}, 'loginToastReminder');
  }, 90 * 1000);
});