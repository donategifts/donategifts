$(document).ready(function () {
  let agencyAddressCheckBox = $('agencyAddressCheckBox');
  agencyAddressCheckBox.addEventListener('click', handleCheckBoxClick);

  function handleCheckBoxClick() {
    if (agencyAddressCheckBox.checked) {
      // if the address is already filled with data ask user to clear it first
      // so that we dont accidentally overwrite it
      if (checkIfAgencyAddressFormIsEmpty()) {
        fetchAgencyData();
      } else {
        const confirmation = confirm('Do you want to overwrite the address with agency address?');
        if (confirmation === true) {
          fetchAgencyData();
        }
      }
    }
  }

  function fetchAgencyData() {
    updateAgencyAddressForm(JSON.parse(agencyAddress));
  }

  // get html nodes and input with agency details from backend
  function updateAgencyAddressForm(agencyAddress) {
    // get all address input elements
    let address1 = $('address1');
    let address2 = $('address2');
    let zipCode = $('address_zip');
    let city = $('address_city');
    let country = $('address_country');
    let state = $('address_state');
    // set new values
    address1.value = agencyAddress.address1;
    address2.value = agencyAddress.address2;
    zipCode.value = agencyAddress.zipcode;
    city.value = agencyAddress.city;
    country.value = agencyAddress.country;
    state.value = agencyAddress.state;
  }

  function checkIfAgencyAddressFormIsEmpty() {
    let address1 = $('address1');
    let address2 = $('address2');
    let zipCode = $('address_zip');
    let city = $('address_city');
    let country = $('address_country');
    let state = $('address_state');
    // if length is zero, input fields are empty
    return (
      (address1.value.length ||
        address2.value.length ||
        zipCode.value.length ||
        city.value.length ||
        country.value.length ||
        state.value.length) === 0
    );
  }

  $('#wishCardForm').on('submit', function (e) {
    e.preventDefault();

    let form = $(this);
    $.ajax({
      type: 'POST',
      url: `/wishcards/edit/${JSON.parse(wishcardId)}`,
      data: form.serialize(),
      timeout: 600000,
      statusCode: {
        200: function (response) {
          $('#wishCardForm')[0].reset();
          showToast('WishCard Updated!');
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
