window.onload = function () {
    let unlockButtons = document.getElementsByClassName("col wishcard-btn btn-navy-bg");
    for (let i = 0; i < unlockButtons.length; i++) {
        unlockButtons[i].addEventListener("click", unlockCardButtonClick);
    }
}

function unlockCardButtonClick(e) {
    const cardId = e.target.dataset.valueId;
    // get reference to element so we can call it inside callback
    const elementRef = e.target;
    $.ajax({
        type: 'PUT',
        url: '/wishcards/admin',
        data: {
          wishCardId: cardId,
        },
        success: function (response, textStatus, xhr) {
          showToast("Card status updated");
          removeWishCardFromDOM(elementRef);
        },
        error: function (response, textStatus, errorThrown) {
            console.log(response);
            console.log(textStatus);
            showToast("Could not update card status. Check console for error");
        },
      });
}

// remove wishcard from dom if card was published
// removes child nodes from the specified div element.
function removeWishCardFromDOM(node) {
    // name of the div container for wishcards
    let divName = "row justify-content-center";
    if (node.parentNode.className !== divName) {
        removeWishCardFromDOM(node.parentNode);
    }
    else {
        while (node.firstChild) {
            node.removeChild(node.lastChild);
          }
    }
}