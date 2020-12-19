let elements = stripe.elements();

// Todo: this needs to be edited
// Custom styling can be passed to options when creating an Element.
let style = {
  base: {
    fontSize: '16px',
    color: '#00a19a',
  },
};

let card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function (event) {
  let displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Form submission.
let form = document.getElementById('payment-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  loading(true);
  stripe.createToken(card).then(function (result) {
    if (result.error) {
      // Inform the user if there was an error.
      let errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
      loading(false);
    } else {
      // Send the token to your server.

      let wishCardId = document.getElementById('cardId');
      let agencyName = document.getElementById('agencyName');
      let userDonation =  document.getElementById('user-donation').innerHTML.replace('$', '');

      fetch('/stripe/createIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishCardId: wishCardId.innerText,
          agencyName: agencyName.innerText,
          userDonation: userDonation
    }),
      })
        .then((response) => response.json())
        .then((data) => {
          payWithCard(stripe, card, data.clientSecret);
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast('An error has occured while processing payment');
          loading(false);
        });
    }
  });
});

let payWithCard = function (stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    })
    .then(function (result) {
      console.log(result)
      if (result.error) {
        showError(result.error.message);
      } else {
        orderComplete(result.paymentIntent.id);
      }
    });
};

let loading = function (isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.getElementById('submit').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.getElementById('submit').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};

let orderComplete = function (paymentIntentId) {
  loading(false);
  document.querySelector('.result-messaging').classList.remove('hidden');
  document.querySelector('#submit').setAttribute('disabled', 'true');
  redirectAfterSuccessfullPayment();
};

let showError = function (errorMsgText) {
  loading(false);
  let errorMsg = document.querySelector('#card-errors');
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = '';
  }, 4000);
};


let showCustomAmountInput = () => {
  let inputAmountElement = document.getElementById("customAmountValue");
  const isVisible = inputAmountElement.style.visibility === 'hidden';
  // if users hides the input reset total amount to 0
  if (!isVisible) {
    let totalAmount = document.getElementById('total-cost-hidden');
    let parsedTotalAmount = parseFloat(totalAmount.innerText);
    inputAmountElement.value = "";
    addCashDonation(parsedTotalAmount, 0);
  }
  inputAmountElement.style.visibility = isVisible ? 'visible' : 'hidden';
}

let addCashDonationFromCustomAmountInput = (originalAmount, e) => {
  let amount = parseFloat(e.value);
  if (amount >= 0) {
    addCashDonation(originalAmount, amount);
  }
}

