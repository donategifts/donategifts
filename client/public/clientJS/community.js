document.addEventListener('submit', function (event) {
  event.preventDefault();
  let buttonUploadPostImage = document.getElementById('postImage');
  let postTextInput = document.getElementById('postText')
  const formData = new FormData();
  formData.append('postImage', buttonUploadPostImage.files[0]);
  formData.append('postText', postTextInput.value);
  console.log(formData)
  fetch('/community/', {
    method: 'POST',
    body: formData 
  })
  .then(response => response.json())
  .then((data) => {
    showToast("Post published");
    location.reload();
  })
  .catch((error) => {
    showToast("Post could not be saved");
    console.log(error)
  });
});