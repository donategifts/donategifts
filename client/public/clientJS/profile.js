$(document).ready(() => {
  function changeImage(input) {
    var reader;

    if (input.files && input.files[0]) {
      reader = new FileReader();

      reader.onload = function (e) {
        preview.setAttribute('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  var fileTag = document.getElementById('filetag');
  var preview = document.getElementById('preview');

  if (fileTag) {
    fileTag.addEventListener('change', function () {
      changeImage(this);
    });
  }

  $('#wishCardForm').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var formdata = new FormData(form[0]);
    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: '/wishcards/',
      data: formdata,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
      statusCode: {
        200: function (route) {
          $('#wishCardForm')[0].reset();
          showToast('WishCard Created!');
          setTimeout(() => location.assign(route), 2000);
        },
        400: function (response) {
          let txtToJson = JSON.parse(response.responseText);
          showToast(txtToJson.error);
        },
      },
    });
  });
});

// About me edit. Click handler
window.onload = function () {
  let buttonSaveProfile = document.getElementById('save-about-me-button');

  // button listener
  function handleSaveAboutMeButtonClick() {
    let aboutMeElemet = document.getElementById('about-me-text');
    let aboutMeText = aboutMeElemet.value;
    updateAboutMe(aboutMeText);
  }

  // submit update request to the server
  function updateAboutMe(info) {
    let aboutMe = { aboutMe: info };
    let url = '/users/profile';
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aboutMe),
    })
      .then((response) => response.json())
      .then((data) => {
        // if there was an error on the backend do not append about me
        if (data.error) {
          showToast('Could not update about me info.');
          console.log(data);
          return;
        }
        let aboutMeElement = document.getElementById('about-me');
        aboutMeElement.innerText = data.data;
      })
      .catch((error) => {
        console.error('Error:', error);
        showToast('Could not update about me info.');
      });
  }

  buttonSaveProfile.addEventListener('click', handleSaveAboutMeButtonClick);
};
