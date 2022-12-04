document.addEventListener('submit', function (event) {
    event.preventDefault();
    let buttonUploadPostImage = document.getElementById('postImage');
    let postTextInput = document.getElementById('postText')
    const formData = new FormData();
    formData.append('postImage', buttonUploadPostImage.files[0]);
    formData.append('postText', postTextInput.value);
    fetch('/community/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then((data) => {
            if (data.statusCode >= 400) {
                showToast(data.error.msg);
                return;
            }
            showToast("Post published");
            location.reload();
        })
        .catch((error) => {
            showToast("Post could not be saved");
        });
});


document.getElementById("postImage").onchange = function () {
    displayImagePreview();
}

function displayImagePreview() {
    const inputElement = document.getElementById("postImage");
    const image = inputElement.files[0];
    if (image) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(image);
        fileReader.addEventListener("load", function () {
            const imageElementContainer = document.getElementById("imagePreview");
            imageElementContainer.innerHTML = '<img class="display-image" src="' + this.result + '" />';
        });
    }
}

