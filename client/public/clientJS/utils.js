// get host name so that the user can be reddirected to login page after
// password reset


function getHostName() {
  let hostName = window.location.hostname;
  switch (hostName) {
    case 'localhost':
      return 'http://localhost:8081';

    case '127.0.0.1':
      return 'http://localhost:8081';

    default:
      return window.location.hostname;
  }
}

let x = [];
function addCountdown(lockedUntil, wishListId, elementId) {

  let countDownDate = new Date(lockedUntil).getTime();

  x[wishListId] = setInterval(function () {

    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate -now;

    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let element = $(elementId);

    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (distance < 0) {
      clearInterval(x[wishListId]);
      x[wishListId] = null;
      element.text("Donate Gift");
      element.prop("disabled",false);
    } else {
      element.text("Locked for " + minutes + ":" + seconds);
      element.prop("disabled",true);
    }

  }, 1000);



}