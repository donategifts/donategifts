let msg = "<div class='loginToastReminder'>More features will be enabled if you log in. <span class='loginToastReminder__link'><a id='loginToastReminder__link__anchor' href=\"/users/signup\">Sign&nbsp;Up</a></span> or <span class='loginToastReminder__link'><a id='loginToastReminder__link__anchor' href=\"/users/login\">Login</a></span></div>"

$(window).on('load', function() {
  setTimeout(function() {
    showToast(msg, undefined, -1, {x:0, y:'7em'}, 'loginToastReminder');
  }, 90 * 1000);
});