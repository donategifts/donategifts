// check clicked element and disable right click if its the element that contains child image
function preventChildImageContextMenu(e) {
  // class name of the element that contains the child image
  let childImageElementClassName = 'card-img-top';

  // take clicked html element
  let firstElementChild = e.target;

  // check if it exists
  if (firstElementChild) {
    // check the class name of the clicked element. If its the one containg child image disable right click
    if (firstElementChild.className === childImageElementClassName) {
      e.preventDefault();
    }
  }
}

socket.on('block', (event) => {
  addCountdown(event.lockedUntil, event.id, '#donate-btn-' + event.id);
});

socket.on('unblock', (event) => {
  const button = $('#donate-btn-' + event.id);

  clearInterval(x[event.id]);
  x[event.id] = null;
  button.text('Donate Gift');
  button.prop('disabled', false);
});

socket.on('donated', (event) => {
  const donateButton = $(document).find('#donate-btn-' + event.id);

  clearInterval(x[event.id]);
  x[event.id] = null;
  donateButton.text('Donated!');
  donateButton.prop('disabled', true);
});
// event listener that fires whenever a right click has occured
window.addEventListener('contextmenu', preventChildImageContextMenu);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function appendWishCards(response, end = false, remove = false) {
  $('#no-result').remove();
  if (remove) {
    $('.wishcard-content').remove();
  }

  var { wishcards, user } = response;

  if (wishcards && wishcards.length > 0) {
    wishcards.forEach((wishCard) => {
      $('#wishcard-container').append(`
      <div class="wishcard-content col-lg-4 col-xs-12 mb-5">
        <div id="card-fix" class="card h-100">
          <div class="view overlay">
            <img id="img-fix" class="card-img-top" src=${wishCard.wishCardImage} alt="Card image" />
            <a href="#">
              <div class="mask rgba-white-slight"></div>
            </a>
          </div>
          <div class="card-body">
            <a href="/wishcards/${wishCard._id}" class="wishcard__icon--fixed msg-icon">
              <i class="far fa-envelope" aria-hidden="true"></i>
            </a>
            <div class="card-text-container">
              <h3 class="card-title text-center crayon-font">My name is ${wishCard.childFirstName}</h3>
              <div class="quick-font">
                <p class="card-text">
                  <span class="font-weight-bold">Wish : </span>
                  ${
                    wishCard.wishItemName.length > 25
                      ? wishCard.wishItemName.substring(0, 25) + '...'
                      : wishCard.wishItemName
                  }
                </p>
                <p class="card-text">
                  <span class="font-weight-bold">Item Price :</span> $${wishCard.wishItemPrice}
                </p>
                <p class="card-text">
                  <span class="font-weight-bold">Interest : </span>
                  ${
                    wishCard.childInterest.length > 30
                      ? wishCard.childInterest.substring(0, 30) + '...'
                      : wishCard.childInterest
                  }
                </p>
              </div>
              <div class="quick-font mt-4 row justify-content-center align-items-center">
                <div class="col-sm-6 my-2 text-center">
                  <a href="/wishcards/${wishCard._id}" class="wishcard__link--white bdr-2"> Read more </a>
                </div>
                <div class="col-sm-6 my-2 text-center">
                  <button 
                    type="button" 
                    data-toggle="modal" 
                    id="donate-btn-${wishCard._id}"
                    class="wishcard__button--blue bdr-2"
                    data-value-url="${wishCard.wishItemURL}"
                    data-value-name="${wishCard.childFirstName}"
                    data-value-id="${wishCard._id}"
                    data-value-emailVerified="${user.emailVerified}"
                    ${
                      user
                        ? `
                          data-value-user="${user._id}"
                          data-target="#wishCardDonateModal"
                          `
                        : 'data-target="#loginModalCenter"'
                    } 
                  >
                    Donate Gift
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    });
  } else {
    if (end) {
      $('#wishcard-container').append('<h3 id="no-result">All available cards loaded</h3>');
    } else {
      $('#wishcard-container').append('<h3 id="no-result">No wishcards available right now</h3>');
    }
  }
}

$(document).ready(function () {
  $('#searchBar').trigger('reset');

  $('#wishcard-container').hide();

  var initialFormData = {
    wishItem: '',
    limit: 25,
    childAge: 14,
  };

  var cardIds = [];

  $.ajax({
    method: 'POST',
    url: '/wishcards/search',
    data: initialFormData,
    success: function (response) {
      response.wishcards.forEach((card) => cardIds.push(card._id));

      appendWishCards(response, null, true);
      $('.loading').hide();
      $('#wishcard-container').show();
    },
    error: function (response) {
      showToast('Server Error!');
    },
  });

  $('#searchBar').submit(function (e) {
    e.preventDefault();

    var formData = $(this)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    $.ajax({
      method: 'POST',
      url: '/wishcards/search',
      data: formData,
      success: function (response) {
        response.wishcards.forEach((card) => !cardIds.includes(card._id) && cardIds.push(card._id));

        appendWishCards(response, null, true);
      },
      error: function (response) {
        showToast(response.responseJSON.error.msg);
      },
    });
  });

  $('#load-more').click(function (e) {
    e.preventDefault();

    var formData = $('#searchBar')
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    $.ajax({
      method: 'POST',
      url: '/wishcards/search',
      data: { ...formData, cardIds },
      success: function (response) {
        response.wishcards.forEach((card) => !cardIds.includes(card._id) && cardIds.push(card._id));

        appendWishCards(response, true);
      },
      error: function (response) {
        showToast('Server Error!');
      },
    });
  });
});
