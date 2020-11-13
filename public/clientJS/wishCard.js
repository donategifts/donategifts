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

// event listener that fires whenever a right click has occured
window.addEventListener("contextmenu", preventChildImageContextMenu);
