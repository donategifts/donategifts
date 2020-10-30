// js lib used from here -> https://github.com/apvarun/toastify-js
// lib is loaded from cdn in footer js since its used everywhere on page

// since we only change toast message
// wrap it so there is less code around
function showToast(message, success = false) {
  var color = success ? '#32a852' : '#8e4dff';

  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'center',
    backgroundColor: `linear-gradient(to right, ${color}, ${color})`,
    stopOnFocus: true,
    className: 'custom-toast',
  }).showToast();
}
