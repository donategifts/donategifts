// About me edit. Click handler
window.onload = function () {
    let buttonSaveProfile = document.getElementById('save-about-me-button');
    let agencyAddressCheckBox = document.getElementById('agencyAddressCheckBox');
    let buttonUploadImage = document.getElementById('buttonUploadImage');
    let buttonRemoveImage = document.getElementById('buttonRemoveImage');

    buttonSaveProfile.addEventListener('click', handleSaveAboutMeButtonClick);
    agencyAddressCheckBox.addEventListener('click', handleCheckBoxClick);
    buttonUploadImage.addEventListener('change', updateProfileImage);
    buttonRemoveImage.addEventListener('click', deleteProfileImage);

    function handleCheckBoxClick() {
        if (agencyAddressCheckBox.checked) {
            // if the address is already filled with data ask user to clear it first
            // so that we dont accidentally overwrite it
            if (checkIfAgencyAddressFormIsEmpty()) {
                fetchAgencyData();
            }
            else {
                const confirmation = confirm('Do you want to overwrite the address with agency address?');
                if (confirmation === true) {
                    fetchAgencyData();
                }
            }
        }
    }

    // button listener
    function handleSaveAboutMeButtonClick() {
        let aboutMeElemet = document.getElementById('about-me-text');
        let aboutMeText = aboutMeElemet.value;
        updateAboutMe(aboutMeText);
    }

    // submit update request to the server
    function updateAboutMe(info) {
        let aboutMe = { aboutMe: info };
        let url = '/users/profile';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aboutMe),
        })
            .then((response) => response.json())
            .then((data) => {
                // if there was an error on the backend do not append about me
                if (data.error) {
                    showToast('Could not update about me info.');
                    console.log(data);
                    return;
                }
                let aboutMeElement = document.getElementById('about-me');
                aboutMeElement.innerText = data.data;
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast('Could not update about me info.');
            });
    }

    function updateProfileImage() {
        const formData = new FormData();
        formData.append('profileImage', buttonUploadImage.files[0]);
        if (buttonUploadImage.files[0]) {
            fetch('/users/profile/picture', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then((data) => {
                    replaceImage(data.data);
                })
                .catch((error) => {
                    showToast("Could not update profile picture");
                    console.log(error)
                });
        }
    };

    function deleteProfileImage() {
        fetch('/users/profile/picture', {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then((data) => {
                replaceImage(data.data);
            })
            .catch((error) => {
                showToast("Could not remove profile picture");
                console.log(error)
            });
    }

    function replaceImage(imagePath) {
        const imgElement = document.getElementById('profilePicture');
        imgElement.src = imagePath;
    }
}