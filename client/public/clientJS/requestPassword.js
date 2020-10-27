$(document).ready(function () {
    $(".request").submit(function (e) {
        e.preventDefault();
        let email = $("#email").val();
        $.ajax({
            type: "POST",
            url:  "/users/password/request",
            data: {
                email: email,
            },
            success: function(response, textStatus, xhr) {
                $("#submit-btn").prop("disabled",false);
                showToast("A password reset link was sent. Click the link in the email to create a new password.");
            },
            error: function(response, textStatus, errorThrown) {
                $("#submit-btn").prop("disabled",false);
                showToast(response.responseJSON.error.msg);
            }
        })
    })
});