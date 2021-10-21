window.onload = function () {
  let showPasswordImage = document.getElementById('showPassword');
  showPasswordImage.addEventListener('click', togglePasswordVisibility);

  function togglePasswordVisibility() {
    const imageHidePath = '../public/img/pass-hide.png';
    const imageVisiblePath = '../public/img/pass-unhide.png';
    const passwordInput = document.getElementById('password');
    const passworInputType = passwordInput.type;
    switch (passworInputType) {
      case 'password':
        passwordInput.type = 'text'
        showPasswordImage.src = imageHidePath
        break;
      
      case 'text':
        passwordInput.type = 'password';
        showPasswordImage.src = imageVisiblePath;
        break;
      default:
        break;
    } 
  };
}