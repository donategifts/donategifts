// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);

    // extract values from button that contain child name / amazonlink
    let childName = button[0].dataset.valueName;
    const wishCardId = button[0].dataset.valueId;
    const amazonURL = button[0].dataset.valueUrl;

    let modalWarningMessage =
        `<div class="quick-font donate-modal" id="donateModalMsg-${wishCardId}">
        <h4 class="crayon-font donate-modal-title">Ready to reserve ${childName}'s wish for donation?</h4>
        <img class="img-fluid modal-img" src="/public/img/setShippingReminder.svg" >
        <p class="modal-p">Follow the new tab link to check out from Amazon.<br/>
        While on the shipping page, under ‘Other Addresses’,
        <strong>choose the gift registry address.</strong></p>
        <p class="donate-subtitle">${childName}'s wish will be reserved for <span class="highlighted">10 minutes</span> to avoid duplicate donations.</p>
        </div>
        <div id="donateBtnWrapper-${wishCardId}">
        <button type="button" id="modal-donate-btn" class="donate-modal-button quick-font">Reserve This Card For Donation</button>
        </div>
        `;

    // get modal reference and replace text
    modal = $(this);
    $('.modal-body').html(modalWarningMessage);
    let donateModalMessages = $(`#donateModalMsg-${wishCardId}`);
    // set  redirect on a ref element

    let isLoggedIn = button[0].dataset.valueLoggedin;
    let reserveBtn = $('#modal-donate-btn');
    let donateBtnWrapper = $(`#donateBtnWrapper-${wishCardId}`);
    if (isLoggedIn === 'false') {
        reserveBtn.html('Please log in to donate')
        reserveBtn.on('click', ()  => location.assign("/users/login"))
    }

    else {

        reserveBtn.on('click', (event) => {
            event.preventDefault();
            window.open(amazonURL, '_blank');

            // ^ this was added by Stacy
            // unsure if this should be here so pls change if needed
            $.ajax({
                type: 'POST',
                url: '/wishcards/lock/' + wishCardId,
                data: {},
                success: (response, textStatus, jqXHR) => {

                    donateModalMessages.html(`<div id="wait-${wishCardId}"></div>
                        <div id="lockedCountdown-${wishCardId}"></div>
                        <div id="status-${wishCardId}"></div>`
                        );

                    donateBtnWrapper.html(
                        `<button class="donate-false" id="donateNotDone-${wishCardId}">I did not donate</button>
                        <button class="donate-true" id="donateDone-${wishCardId}">I completed the checkout</button>`
                    );

                    addCountdownToModal(response.lockedUntil, wishCardId, '#lockedCountdown-' + wishCardId);

                    let waitDiv = $('#wait-' + wishCardId);
                    let statusDiv = $('#status-' + wishCardId);
                    let donateDoneButton = $('#donateDone-' + wishCardId);
                    let spinner = $('#spinner-border');

                    donateDoneButton.on('click', (event) => {

                        $(`#lockedCountdown-${wishCardId}`).hide();
                        waitDiv.html(`<div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                        </div>
                        Confirming your Donation - Please wait. This may take up to 2 minutes.`)
                        waitDiv.show();
                        spinner.show();

                        $('#wait-' + wishCardId).show();
                        $.ajax({
                            type: 'GET',
                            url: '/wishcards/status/' + wishCardId,
                            data: {},
                            success: (response, textStatus, jqXHR) => {
                                console.log(response)
                            },
                            error: (response, textStatus, errorThrown) => {
                                console.log(response)

                            },
                        });
                    })

                    socket.on('donated', event => {

                        if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser) {
                            spinner.hide();
                            statusDiv.html('Donation Confirmed')
                            waitDiv.hide();

                        }

                    });

                    socket.on('not_donated', event => {

                        
                        if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser) {
                            spinner.hide();
                            waitDiv.hide();
                            statusDiv.html('Donation Not Confirmed')
                            //TODO show sad faces
                            //TODO we should do an exit survey -stacy-
                        }

                    });

                },
                error: (response, textStatus, errorThrown) => {
                    showToast(response.responseJSON.error.msg)
                    $('#modal-donate-btn').prop('disabled', false)
                },
            });
        })
}


});

let locked = [];

function addCountdownToModal(lockedUntil, wishListId, elementId) {
    let countDownDate = new Date(lockedUntil).getTime();

    locked[wishListId] = setInterval(function () {
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let element = $(elementId);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        if (distance < 0) {
            clearInterval(locked[wishListId]);
            locked[wishListId] = null;
            element.text('');

        } else {
            element.html(
                '<div class="donate-modal"><h1 class="crayon-font donate-modal-title">You reserved this wish card for</h1>' +
                '<div class="cool-font countdown">' +
                minutes + ' : ' + seconds +
                '</div>' + '<div><i class="modal-i fa fa-amazon" aria-hidden="true"></i> <i class="fa fa-long-arrow-right" aria-hidden="true"></i>' +
                '<i class="modal-i fa fa-shopping-cart" aria-hidden="true"></i> <i class="fa fa-long-arrow-right" aria-hidden="true"></i>' +
                '<i class="modal-i fa fa-check-square-o" aria-hidden="true"></i> <i class="fa fa-long-arrow-right" aria-hidden="true"></i>' +
                '<i class="modal-i fa fa-envelope-open-o" aria-hidden="true"></i></div>' +
                '<p class="quick-font donate-subtitle">This wish item is added to your Amazon cart in the new tab that will open.</p>' +
                '<p class="quick-font donate-subtitle">Return to this screen & confirm your donation once checkout is finished.</p></div>'
            );
        }
    }, 1000);
}