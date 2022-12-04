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

// event listener that fires whenever a right click has occured
window.addEventListener('contextmenu', preventChildImageContextMenu);


function getReadMoreBtn(user, wishCardId) {
  return `<a href="/wishcards/${wishCardId}" class="wishcard__link--white bdr-2">View more</a>`
}

function getDonatedBtn(user, wishCardId, wishCardStatus) {
  if (wishCardStatus === 'donated') {
    return `<button type="button" class="wishcard__button--disabled bdr-2" disabled aria-disabled=true> Donated </button>`;
  } else if (user) {
    return `<a href="wishcards/donate/${wishCardId}"><button type="button" class="wishcard__button--blue bdr-2"> Donate Gift </button></a>`;
  } else {
    return `<button type="button" data-toggle="modal" class="wishcard__button--blue bdr-2"
    data-target="#loginModalCenter"> Donate Gift </button>`;
  }
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
            <div class="card-details">
              <h3 class="card-title text-center crayon-font">My name is ${wishCard.childFirstName}</h3>
              <div class="quick-font">
                <p>
                  <span class="font-weight-bold">Wish : </span>
                  ${wishCard.wishItemName.length > 24
          ? wishCard.wishItemName.substring(0, 23) + '...'
          : wishCard.wishItemName
        }
                </p>
                <p class="wish-price">
                  <span class="font-weight-bold">Item Price :</span> $${wishCard.wishItemPrice}
                </p>
                <p>
                  <span class="font-weight-bold">Interest : </span>
                  ${wishCard.childInterest.length > 24
          ? wishCard.childInterest.substring(0, 21) + '...'
          : wishCard.childInterest
        }
                </p>
              </div>
              <div class="card-action row">
                <div class="col-sm-6 mb-2">
                ${getReadMoreBtn(user, wishCard._id)}
                </div>
                <div class="col-sm-6 mb-2">
                ${getDonatedBtn(user, wishCard._id, wishCard.status)}
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

  var cardIds = [];

  $.ajax({
    method: 'POST',
    url: '/wishcards/search/1',
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
