let elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
let style = {
  base: {
    fontSize: '16px',
    color: '#32325d',
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
  stripe.createToken(card).then(function (result) {
    if (result.error) {
      // Inform the user if there was an error.
      let errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      let wishCardId = document.getElementById('cardId');
      let agencyName = document.getElementById('agencyName');
      fetch('/stripe/createIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishCardId: wishCardId.innerText,
          agencyName: agencyName.innerText,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          payWithCard(stripe, card, data.clientSecret);
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast('An error has occured while processing payment');
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
    document.querySelector('button').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('button').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};

let orderComplete = function (paymentIntentId) {
  loading(false);
  document
    .querySelector('.result-message a')
    .setAttribute('href', 'https://dashboard.stripe.com/test/payments/' + paymentIntentId);
  document.querySelector('.result-message').classList.remove('hidden');
  document.querySelector('#submit').setAttribute('disabled', 'true');
  showToast('Payment successfull', 'green');
};

let showError = function (errorMsgText) {
  loading(false);
  let errorMsg = document.querySelector('#card-error');
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = '';
  }, 4000);
};
