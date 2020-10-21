// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);
    console.log(button[0].dataset)
    // extract values from button that contain child name / amazonlink
    let childName = button[0].dataset.valueName;

    let modalWarningMessage = ` Hello, before proceeding we want to make sure that you are certain that you want to donate. 
        Since we can not follow the donation process from Amazon we trust that you will follow the process to the end 
        and buy the selected item for ${childName}. Once you click on the "Donate gift" button you will be redirected to Amazon and we will 
        inform ${childName} that the gift is on its way. If for some reason you are unable to place the order on Amazon but you have clicked 
        on the donate gift button send us an email.
        Thank you very much :)`;
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

    donateButton.on('click', (event) => {
        event.preventDefault();
        //('#wishCardDonateModal').find('.modal-body').html(modalWarningMessage);

        $.ajax({
            type: 'POST',
            url: '/wishcards/lock/' + button[0].dataset.valueId,
            data: {},
            success: (response, textStatus, jqXHR) => {
                console.log(textStatus);
                $('#modal-donate-btn').off();
                modal.find('.modal-body').html('ADD STUFF IF USER DONATED OR NOT');

                setTimeout(() => {
                  window.open(button[0].dataset.valueUrl, '_blank');
                }, 2000)
            },
            error: (response, textStatus, errorThrown) => {
                console.log(textStatus);
                showToast('You have already reserved a wishcard')
                $('#modal-donate-btn').off();
            },
        });

    })

});

