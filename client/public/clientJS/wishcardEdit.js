window.onload = function () {
  let agencyAddressCheckBox = document.getElementById('agencyAddressCheckBox');
  agencyAddressCheckBox.addEventListener('click', handleCheckBoxClick);

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
    updateAgencyAddressForm(JSON.parse(agencyAddress));
  }

  // get html nodes and input with agency details from backend
  function updateAgencyAddressForm(agencyAddress) {
    // get all address input elements
    let address1 = document.getElementById('address1');
    let address2 = document.getElementById('address2');
    let zipCode = document.getElementById('address_zip');
    let city = document.getElementById('address_city');
    let country = document.getElementById('address_country');
    let state = document.getElementById('address_state');
    // set new values
    address1.value = agencyAddress.address1;
    address2.value = agencyAddress.address2;
    zipCode.value = agencyAddress.zipcode;
    city.value = agencyAddress.city;
    country.value = agencyAddress.country;
    state.value = agencyAddress.state;
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
}