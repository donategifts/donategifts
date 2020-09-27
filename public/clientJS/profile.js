$(document).ready(() => {
    var fileTag = document.getElementById("filetag"),
        preview = document.getElementById("preview");
    fileTag.addEventListener("change", function () {
        changeImage(this);
    });

    function changeImage(input) {
        var reader;

        if (input.files && input.files[0]) {
            reader = new FileReader();

            reader.onload = function (e) {
                preview.setAttribute('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

});


// About me edit. Click handler 
window.onload = function() {
    let buttonSaveProfile = document.getElementById("save-about-me-button");

    // button listener
    function handleSaveAboutMeButtonClick() {
        let aboutMeElemet = document.getElementById("about-me-text");
        let aboutMeText = aboutMeElemet.value;
        updateAboutMe(aboutMeText);
        
    }

    // submit update request to the server
    function updateAboutMe(info) {
        let aboutMe = {aboutMe: info};
        let url = "/users/profile";
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(aboutMe),
            })
            .then(response => response.json())
            .then(data => {
                let aboutMeElement = document.getElementById("about-me");
                aboutMeElement.innerText = data.data;
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Could not update about me. Check console for error details");
            });
    }

    buttonSaveProfile.addEventListener("click", handleSaveAboutMeButtonClick);
}



