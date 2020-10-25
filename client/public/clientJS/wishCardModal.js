// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);
    console.log(button[0].dataset)
    // extract values from button that contain child name / amazonlink
    let childName = button[0].dataset.valueName;

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
        //('#wishCardDonateModal').find('.modal-body').html(modalWarningMessage);

        $.ajax({
            type: 'POST',
            url: '/wishcards/lock/' + button[0].dataset.valueId,
            data: {},
            success: (response, textStatus, jqXHR) => {

                modal.find('.modal-body').html('<div id="countdown"></div><button id="didthething">I did the thing</button><button id="didntdoit">I didnt do nothin</button>PRETTIFY THIS WITH TWO BUTTONS PLEASE THANKSBYE');

                let timer = 5;
                const countDownDiv = $('#countdown');

                const countdown = setInterval(() => {
                    if (timer < 0) {
                        countDownDiv.hide();
                        //window.open(button[0].dataset.valueUrl, '_blank');
                        clearInterval(countdown);
                    }
                    countDownDiv.html('You will be redirect to Amazon in ' + timer);
                    timer--

                }, 1000);

                socket.on('donated', event => {

                    if (event.id === button[0].dataset.valueId && event.donatedBy === button[0].dataset.user){
                        console.log('WOOOOOOHOOOOOO')
                        //TODO show balloons and firework play party sounds
                    }

                });

            },
            error: (response, textStatus, errorThrown) => {
                showToast(response.responseJSON.error)
                $('#modal-donate-btn').prop('disabled', false)
            },
        });

    })


});

$(document).on('click', '#didthething', (event) => {
    console.log('CLICK')
})
