window.onload = function () {
  let showPasswordImage = document.getElementById('showPassword');
  showPasswordImage.addEventListener('click', togglePasswordVisibility);

  function togglePasswordVisibility() {
    const imageHideClass = 'fas fa-eye';
    const imageVisibleClass = 'fas fa-eye-slash';
    const passwordInput = document.getElementById('password');
    const passworInputType = passwordInput.type;
    switch (passworInputType) {
      case 'password':
        passwordInput.type = 'text'
        showPasswordImage.className = imageVisibleClass;
        break;
      
      case 'text':
        passwordInput.type = 'password';
        showPasswordImage.className = imageHideClass;
        break;
      default:
        break;
    } 
  };
}