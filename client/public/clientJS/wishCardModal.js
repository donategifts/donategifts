// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);

    // extract values from button that contain child name / amazonlink
    let childName = button[0].dataset.valueName;
    const wishCardId = button[0].dataset.valueId;

    let modalWarningMessage = `<h1>This wish card will be reserved for your donation</h1>
        <h4>for 10 minutes to avoid duplicate donations.</h4>
        <h4>Once redirected to Amazon, please select ${childName}'s anonymized shipping address before you check out.</h4>`;
    // get modal reference and replace text
    modal = $(this);
    modal.find('.modal-body').html(modalWarningMessage);
    // set  redirect on a ref element

    let isLoggedIn = button[0].dataset.valueLoggedin;
    let donateButton =  $('#modal-donate-btn');
    if (isLoggedIn === 'false') {
        donateButton.html('Please login to donate')
        donateButton.prop('disabled', true)
    }

    donateButton.off();
    donateButton.on('click', (event) => {
        event.preventDefault();
        //('#wishCardDonateModal').fin
        //d('.modal-body').html(modalWarningMessage);

        $.ajax({
            type: 'POST',
            url: '/wishcards/lock/' + wishCardId,
            data: {},
            success: (response, textStatus, jqXHR) => {

                console.log(response);

                modal.find('.modal-body').html('' +
                  '<div id="wait-' + wishCardId + '">' +
                  'PLEASE WAIT THis can take up to 2 minutes</div> ' +
                  '<div id="lockedCountdown-' + wishCardId + '"></div>' +
                  '<div id="status-' + wishCardId + '"></div></div>' +
                  '<div id="countdown-' + wishCardId + '"></div>' +
                  '<div id="diditornot-' + wishCardId + '">' +
                  ' <button id="didthething-' + wishCardId + '">I did the thing</button>' +
                  ' <button id="didntdoit-' + wishCardId + '">I didnt do nothin</button>' +
                  '</div>');

                addCountdownToModal(response.lockedUntil, wishCardId, '#lockedCountdown-' + wishCardId);

                const waitDiv = $('#wait-'+ wishCardId);
                const statusDiv = $('#status-'+ wishCardId);
                const didTheThingButton = $('#didthething-'+ wishCardId);
                const didntDoItButton = $('#didntdoit-'+ wishCardId);
                const countDownDiv = $('#countdown-'+ wishCardId);

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

                    if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser){
                        statusDiv.html('DONATION CONFIRMED')
                        waitDiv.hide();

                        //TODO show balloons and firework play party sounds
                    }

                });

                socket.on('not_donated', event => {

                    if (event.id === wishCardId && event.donatedBy === button[0].dataset.valueUser){
                        waitDiv.hide();
                        statusDiv.html('DONATION NOT CONFIRMED')
                        //TODO show sad faces
                    }

                });

                didTheThingButton.on('click', (event) => {
                    console.log('CLICK')

                    $('#wait-'+ wishCardId).show();
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
            clearInterval(x[wishListId]);
            locked[wishListId] = null;
            element.text('');

        } else {
            element.text('Locked for you for ' + minutes + ':' + seconds);
        }
    }, 1000);
}


