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
}