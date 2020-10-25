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
        //('#wishCardDonateModal').fin
        //d('.modal-body').html(modalWarningMessage);

        $.ajax({
            type: 'POST',
            url: '/wishcards/lock/' + button[0].dataset.valueId,
            data: {},
            success: (response, textStatus, jqXHR) => {


                modal.find('.modal-body').html('' +
                  '<div id="wait-' + button[0].dataset.valueId + '">' +
                  'PLEASE WAIT THis can take up to 2 minutes</div> ' +
                  '<div id="status-' + button[0].dataset.valueId + '"></div></div>' +
                  '<div id="countdown-' + button[0].dataset.valueId + '"></div>' +
                  '<div id="diditornot-' + button[0].dataset.valueId + '">' +
                  ' <button id="didthething-' + button[0].dataset.valueId + '">I did the thing</button>' +
                  ' <button id="didntdoit-' + button[0].dataset.valueId + '">I didnt do nothin</button>' +
                  '</div>');
                $('#wait-'+ button[0].dataset.valueId).hide();
                $('#didthething-'+ button[0].dataset.valueId).prop('disabled', true);
                $('#didntdoit-'+ button[0].dataset.valueId).prop('disabled', true);

                let timer = 5;
                const countDownDiv = $('#countdown-'+ button[0].dataset.valueId);

                countdown[button[0].dataset.valueId] = setInterval(() => {
                    if (timer < 0) {
                        countDownDiv.hide();
                        //window.open(button[0].dataset.valueUrl, '_blank');
                        $('#didthething-'+ button[0].dataset.valueId).prop('disabled', false);
                        $('#didntdoit-'+ button[0].dataset.valueId).prop('disabled', false);
                        clearInterval(countdown[button[0].dataset.valueId]);
                    }
                    countDownDiv.html('You will be redirect to Amazon in ' + timer);
                    timer--

                }, 1000);

                socket.on('donated', event => {
                    console.log('DONATION CONFIRMED')

                    if (event.id === button[0].dataset.valueId && event.donatedBy === button[0].dataset.valueUser){
                        $('#status-'+ button[0].dataset.valueId).html('DONATION CONFIRMED')

                        //TODO show balloons and firework play party sounds
                    }

                });

                socket.on('not_donated', event => {

                    if (event.id === button[0].dataset.valueId && event.donatedBy === button[0].dataset.valueUser){
                        console.log('DONATION NOT CONFIRMED')
                        $('#status-'+ button[0].dataset.valueId).html('DONATION NOT CONFIRMED')
                        //TODO show balloons and firework play party sounds
                    }

                });

                $('#didthething-'+ button[0].dataset.valueId).on('click', (event) => {
                    console.log('CLICK')

                    $('#wait-'+ button[0].dataset.valueId).show();
                    $.ajax({
                        type: 'GET',
                        url: '/wishcards/status/' + button[0].dataset.valueId,
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
                showToast(response.responseJSON.error)
                $('#modal-donate-btn').prop('disabled', false)
            },
        });

    })


});


