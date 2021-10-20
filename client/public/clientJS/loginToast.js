let myLoginToast;
$(window).on('load', function() {
  //Session storage for Login Toast. If key is not null, will show Toast and set key value to 1.
  const LoginToastShow = sessionStorage.getItem('LoginToastShow');
  if ( LoginToastShow == null) {
    sessionStorage.setItem('LoginToastShow', 1);
  myLoginToast = setTimeout(function() {
    let msg = "<div class='loginToastReminder'>More features will be enabled if you log in. <span class='loginToastReminder__link'><a id='loginToastReminder__link__anchor' href=\"/users/signup\">Sign&nbsp;Up</a></span> or <span class='loginToastReminder__link'><a id='loginToastReminder__link__anchor' href=\"/users/login\">Login</a></span></div>"
    showToast(msg, undefined, -1, { x: 0, y: '7em' }, 'loginToastReminder', false);
    }, 90 * 1000);
  }
});

//Clears timeout and loginToastReminder does not show if 'Donate Gift' button is clicked on a wishcard.
$('div.col-sm-6.my-2.text-center > button.wishcard__button--blue.bdr-2').click(function() {
  clearTimeout(myLoginToast);
});
