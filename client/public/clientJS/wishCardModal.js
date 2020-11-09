// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    const button = $(event.relatedTarget);

    // extract values from button that contain child name / amazonlink
    const childName = button[0].dataset.valueName;
    const wishCardId = button[0].dataset.valueId;
    const amazonURL = button[0].dataset.valueUrl;
    const modalBody = $('.modal-body');

    const modalWarningMessage =
        `<div class="quick-font donate-modal" id="donateModalMsg-${wishCardId}">
        <h4 class="crayon-font donate-modal-title">Ready to reserve ${childName}'s wish for donation?</h4>
        <img class="img-fluid modal-img" src="/public/img/setShippingReminder.svg" >
        <p class="modal-p">Follow the new tab link to check out from Amazon.<br/>
        While on the shipping page, under ‘Other Addresses’,
        <strong>choose the gift registry address.</strong></p>
        <p class="donate-subtitle">${childName}'s wish will be reserved for <span class="highlighted">10 minutes</span> to avoid duplicate donations.</p>
        </div>
        <div id="donateBtnWrapper-${wishCardId}">
        <button type="button" id="modal-donate-btn" class="donate-modal-button quick-font">Reserve this wish for donation</button>
        </div>
        `;

    // get modal reference and replace text
    modalBody.html(modalWarningMessage);
    // set  redirect on a ref element

    const isLoggedIn = button[0].dataset.valueLoggedin;
    const reserveBtn = $('#modal-donate-btn');

    if (isLoggedIn === 'false') {
        reserveBtn.html('Please log in to donate')
        $(document).on('click', '#modal-donate-btn', (event) => {
            location.assign("/users/login")
        });
    } else {

        $(document).on('click', '#modal-donate-btn', (event) => {
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/wishcards/lock/' + wishCardId,
                data: {},
                success: (response, textStatus, jqXHR) => {

                    // Hide modal header to prevent closing the modal
                    $('.modal-header').hide();

                    const donateModalMessages = modalBody.find(`#donateModalMsg-${wishCardId}`);
                    donateModalMessages.html(`<div id="wait-${wishCardId}"></div>
                        <div id="lockedCountdown-${wishCardId}"></div>
                        <div id="status-${wishCardId}"></div>`);

                    //decided to make an additional Amazon button
                    const donateBtnWrapper = modalBody.find(`#donateBtnWrapper-${wishCardId}`);
                    donateBtnWrapper.html(`<div class="donate-button-container">
                            <button class="donate-modal-button" id="openAmazonBtn">I'm ready to checkout</button>
                            <button class="donate-true" id="donateDone-${wishCardId}">I finished the checkout</button>
                        </div>
                        <p class="donate-false" id="donateNotDone-${wishCardId}" onclick="$('#wishCardDonateModal').modal('hide')">Changed your mind? Click here to exit.</p>`
                    );

                    const openAmazonBtn = modalBody.find('#openAmazonBtn');
                    openAmazonBtn.on('click', (event) => {
                        event.preventDefault();
                        window.open(amazonURL, '_blank');

                    });

                    addCountdownToModal(response.lockedUntil, wishCardId, '#lockedCountdown-' + wishCardId);

                    const waitDiv = modalBody.find('#wait-' + wishCardId);
                    const statusDiv = modalBody.find('#status-' + wishCardId);
                    const donateDoneButton = modalBody.find('#donateDone-' + wishCardId);
                    const spinner = modalBody.find('#spinner-border');

                    donateDoneButton.on('click', (event) => {

                        showLoadingView();

                        modalBody.find('#wait-' + wishCardId).show();
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
                            $('.modal-header').show();

                            spinner.hide();
                            waitDiv.hide();
                            clearInterval(locked[wishCardId]);

                            statusDiv.html('Donation Confirmed')

                        }

                    });

                    socket.on('not_donated', event => {

                        if (event.id === wishCardId && event.userId === button[0].dataset.valueUser) {
                            spinner.hide();
                            waitDiv.hide();

                            statusDiv.html('Donation Not Confirmed')

                            //TODO we should do an exit survey eventually -stacy-
                        }

                    });

                    //is fired when user is not pressing anything
                    socket.on('countdown_ran_out', event => {

                        if (event.id === wishCardId && event.userId === button[0].dataset.valueUser) {
                            showLoadingView();
                        }

                    });


                    function showLoadingView() {

                        // Hide modal header to prevent closing the modal
                        $('.modal-header').hide();

                        // Hide buttons
                        $(`#donateBtnWrapper-${wishCardId}`).hide();

                        $(`#lockedCountdown-${wishCardId}`).hide();
                        waitDiv.html(
                          `<div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <p class="spinner-text">Confirming your Donation - Please wait. This may take up to 2 minutes.</p>`
                        );
                        waitDiv.show();
                        spinner.show();
                    }

                },
                error: (response, textStatus, errorThrown) => {
                    showToast(response.responseJSON.error.msg)
                    $('#modal-donate-btn').prop('disabled', false)
                },
            });
        })
    }


});



locked = [];

function disableButton(ButtonElement, disable) {
    if (disable) {
        ButtonElement.prop('disabled', true);
        ButtonElement.prop('aria-disabled', true);
    } else {
        ButtonElement.prop('disabled', null);
        ButtonElement.prop('aria-disabled', false);
    }
}

function addCountdownToModal(lockedUntil, wishCardId, elementId) {
    const countDownDate = new Date(lockedUntil).getTime();

    locked[wishCardId] = setInterval(function () {
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countDownDate - now;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const element = $('.modal-body').find(elementId);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        if (distance < 0) {
            clearInterval(locked[wishCardId]);
            locked[wishCardId] = null;
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