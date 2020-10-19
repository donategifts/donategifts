// check clicked element and disable right click if its the element that contains child image
function preventChildImageContextMenu(e) {
    // class name of the element that contains the child image
    let childImageElementClassName = "card-img-top";

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

const socket = io('wsdev.donate-gifts.com');
let x = [];
socket.on('block', event => {

    // Get today's date and time

    let countDownDate = new Date(event.lockedUntil).getTime();
    x[event.id] = setInterval(function () {

        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate -now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let button = $('#donate-btn-'+event.id);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (distance < 0) {
            clearInterval(x[event.id]);
            x[event.id] = null;
            button.text("Donate Gift");
            button.prop("disabled",false);
        } else {
            button.text("Locked for " + minutes + ":" + seconds);
            button.prop("disabled",true);
        }

    }, 1000);




});

socket.on('unblock', event => {

    let button = $('#donate-btn-'+event.id);

    clearInterval(x[event.id]);
    x[event.id] = null;
    button.text("Donate Gift");
    button.prop("disabled",false);
});
// event listener that fires whenever a right click has occured
window.addEventListener("contextmenu", preventChildImageContextMenu);
