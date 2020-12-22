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
        200: function (response) {
          $('#wishCardForm')[0].reset();
          showToast('WishCard Created!');
          setTimeout(() => location.assign(response.url), 2000);
        },
        400: function (response) {
          showToast(response.responseJSON.error.msg);
        },
        403: function (responseObject) {
          showToast('Access Forbidden: Your account lacks sufficient permissions');
          let { url } = responseObject.responseJSON;
          setTimeout(() => location.assign(url), 1200);
        },
      },
    });
  });
});

// About me edit. Click handler
window.onload = function () {
  let buttonSaveProfile = document.getElementById('save-about-me-button');
  let agencyAddressCheckBox = document.getElementById('agencyAddressCheckBox');
  let buttonUploadImage = document.getElementById('buttonUploadImage');
  let buttonRemoveImage = document.getElementById('buttonRemoveImage');

  buttonSaveProfile.addEventListener('click', handleSaveAboutMeButtonClick);
  agencyAddressCheckBox.addEventListener('click', handleCheckBoxClick);
  buttonUploadImage.addEventListener('change', updateProfileImage);
  buttonRemoveImage.addEventListener('click', deleteProfileImage);

  function handleCheckBoxClick() {
    if (agencyAddressCheckBox.checked) {
      // if the address is already filled with data ask user to clear it first
      // so that we dont accidentally overwrite it
      if (checkIfAgencyAddressFormIsEmpty()) {
        fetchAgencyData();
      }
      else {
        const confirmation = confirm('Do you want to overwrite the address with agency address?');
        if (confirmation === true) {
          fetchAgencyData();
        }
      }
    }
  }

  function fetchAgencyData() {
    fetch('/users/agency/address')
      .then((response) => response.json())
      .then((data) => {
        const agency = data.data;
        if (agency.agencyAddress) {
          updateAgencyAddressForm(agency);
        }
        else {
          showToast('Agency address not present. Most likely that information is missing, contact the administrator.');
        }
      })
      .catch((error) => {
        showToast('Could not get agency address.');
      })
  }

  // get html nodes and input with agency details from backend
  function updateAgencyAddressForm(agencyDetails) {
    // get all address input elements
    let address1 = document.getElementById('address1');
    let address2 = document.getElementById('address2');
    let zipCode = document.getElementById('address_zip');
    let city = document.getElementById('address_city');
    let country = document.getElementById('address_country');
    let state = document.getElementById('address_state');
    // set new values
    address1.value = agencyDetails.agencyAddress.address1;
    address2.value = agencyDetails.agencyAddress.address2;
    zipCode.value = agencyDetails.agencyAddress.zipcode;
    city.value = agencyDetails.agencyAddress.city;
    country.value = agencyDetails.agencyAddress.country;
    state.value = agencyDetails.agencyAddress.state;
  }

  function checkIfAgencyAddressFormIsEmpty() {
    let address1 = document.getElementById('address1');
    let address2 = document.getElementById('address2');
    let zipCode = document.getElementById('address_zip');
    let city = document.getElementById('address_city');
    let country = document.getElementById('address_country');
    let state = document.getElementById('address_state');
    // if length is zero, input fields are empty
    return (address1.value.length || address2.value.length || zipCode.value.length || city.value.length || country.value.length || state.value.length) === 0;
  }

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

  function updateProfileImage() {
    const formData = new FormData();
    formData.append('profileImage', buttonUploadImage.files[0]);
    if (buttonUploadImage.files[0]) {
      fetch('/users/profile/picture', {
        method: 'POST',
        body: formData 
      })
      .then(response => response.json())
      .then((data) => {
        replaceImage(data.data);
      })
      .catch((error) => {
        showToast("Could not update profile picture");
        console.log(error)
      });
    }   
  };

  function deleteProfileImage() {
    fetch('/users/profile/picture', {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then((data) => {
      replaceImage(data.data);
    })
    .catch((error) => {
      showToast("Could not remove profile picture");
      console.log(error)
    });
  }

  function replaceImage(imagePath) {
    const imgElement = document.getElementById('profilePicture');
    imgElement.src = imagePath;
  }
}