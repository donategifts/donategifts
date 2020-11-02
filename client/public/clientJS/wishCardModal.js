// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);

    // extract values from button that contain child name / amazonlink
    let childName = button[0].dataset.valueName;
    const wishCardId = button[0].dataset.valueId;

    let modalWarningMessage =
        `<div class="quick-font donate-modal">
        <h4 class="crayon-font donate-modal-title">Ready to reserve ${childName}'s wish for donation?</h4>
        <img class="img-fluid modal-img" src="/public/img/setShippingReminder.svg" >
        <p class="modal-p">Follow the new tab link to check out from Amazon.<br/>
        While on the shipping page, under ‘Other Addresses’,
        <strong>choose the gift registry address.</strong></p>
        <p class="donate-subtitle">${childName}'s wish will be reserved for <span class="highlighted">10 minutes</span> to avoid duplicate donations.</p>
    </div>
    `;
    // get modal reference and replace text
    modal = $(this);
    modal.find('.modal-body').html(modalWarningMessage);
    // set  redirect on a ref element

    let isLoggedIn = button[0].dataset.valueLoggedin;
    let donateButton = $('#modal-donate-btn');
    if (isLoggedIn === 'false') {
        donateButton.html('Please log in to donate')
        donateButton.prop('disabled', true)
    }

    donateButton.off();
    donateButton.on('click', (event) => {
        event.preventDefault();
        donateButton.html('<div id="didthething-' + wishCardId + '">I completed the checkout</div>');
        // ^ this was added by Stacy
        // unsure if this should be here so pls change if needed
        $.ajax({
            type: 'POST',
            url: '/wishcards/lock/' + wishCardId,
            data: {},
            success: (response, textStatus, jqXHR) => {

                console.log(response);

                modal.find('.modal-body').html('' +
                    '<div id="wait-' + wishCardId + '">' +
                    'Please wait. This may take up to 2 minutes.</div> ' +
                    '<div id="lockedCountdown-' + wishCardId + '"></div>' +
                    '<div id="status-' + wishCardId + '"></div></div>' +
                    '<div id="countdown-' + wishCardId + '"></div>' +
                    '<div class="row" id="diditornot-' + wishCardId + '">' +
                    ' <button class="donate-false" id="didntdoit-' + wishCardId + '">I did not donate</button>' +
                    // ' <button class="donate-true" id="didthething-' + wishCardId + '">I completed the checkout</button>' +
                    '</div>');

                addCountdownToModal(response.lockedUntil, wishCardId, '#lockedCountdown-' + wishCardId);

                const waitDiv = $('#wait-' + wishCardId);
                const statusDiv = $('#status-' + wishCardId);
                const didTheThingButton = $('#didthething-' + wishCardId);
                const didntDoItButton = $('#didntdoit-' + wishCardId);
                const countDownDiv = $('#countdown-' + wishCardId);

                waitDiv.hide();
                didTheThingButton.prop('disabled', true);
                didntDoItButton.prop('disabled', true);

                let timer = 5;

                countdown[wishCardId] = setInterval(() => {
                    if (timer < 0) {
                        countDownDiv.hide();
                        //window.open(button[0].dataset.valueUrl, '_blank');
                        didTheThingButton.prop('disabled', false);
                        didntDoItButton.prop('disabled', false);
                        clearInterval(countdown[wishCardId]);
                    }
                    countDownDiv.html('You will be redirect to Amazon in ' + timer);
                    timer--

                }, 1000);

                socket.on('donated', event => {

                    if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser) {
                        statusDiv.html('DONATION CONFIRMED')
                        waitDiv.hide();

                    }

                });

                socket.on('not_donated', event => {

                    if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser) {
                        waitDiv.hide();
                        statusDiv.html('DONATION NOT CONFIRMED')
                        //TODO show sad faces
                        //TODO we should do an exit survey -stacy-
                    }

                });

                didTheThingButton.on('click', (event) => {
                    console.log('CLICK')

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

            },
            error: (response, textStatus, errorThrown) => {
                showToast(response.responseJSON.error.msg)
                $('#modal-donate-btn').prop('disabled', false)
            },
        });

    })


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