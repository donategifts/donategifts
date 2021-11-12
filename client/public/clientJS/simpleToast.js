// js lib used from here -> https://github.com/apvarun/toastify-js
// lib is loaded from cdn in footer js since its used everywhere on page

// since we only change toast message
// wrap it so there is less code around
function showToast(message, success = false, duration= 3000, offset={x:0, y:0}, className= 'custom-toast', escapeMarkup = true) {
  var color = success ? '#ff826b' : '#ff5c6f';

  //Login toast has duration of -1(displays until closed by user), styling is below for it.
  if(duration === -1){
    color = 'rgba(248, 228, 201, 0.8)'
  }

  Toastify({
    text: message,
    duration,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'center',
    backgroundColor: `linear-gradient(to right, ${color}, ${color})`,
    stopOnFocus: true,
    className,
    offset,
    escapeMarkup,
  }).showToast();
}
