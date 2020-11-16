$(document).ready(function () {
    $(".request").submit(function (e) {
        e.preventDefault();
        $("#submit-btn").prop("disabled",true);
        let url = $(".request").attr("action");
        let password = $("#password").val();
        let passwordConfirm = $("#passwordConfirm").val();
        $.ajax({
            type: "POST",
            url:  url,
            data: {
                password: password,
                passwordConfirm: passwordConfirm,
            },
            success: function(response, textStatus, xhr) {
                $("#submit-btn").prop("disabled",false);
                showToast("Password Changed. You will be redirected to login page");
                setTimeout(() => {
                    window.location.replace(`${getHostName()}/users/login`);
                }, 4000);
            },
            error: function(response, textStatus, errorThrown) {
                $("#submit-btn").prop("disabled",false);
                showToast(response.responseJSON.error.msg);
            }
        })
    })
});

 // check if password 1 is the same as password 2
window.onload = function() {
    let password2Element = document.getElementById("passwordConfirm");
    password2Element.onblur = function() {
        let passwordElement = document.getElementById("password");
        if (password2Element.value !== passwordElement.value) {
            password2Element.setCustomValidity("Passwords Don't Match");
        } else {
            password2Element.setCustomValidity('');
        }
    }
}

// get host name so that the user can be reddirected to login page after
// password reset
function getHostName() {
    let hostName = window.location.hostname;
    switch (hostName) {
        case "localhost":
            return "http://localhost:8081";
        
        case "127.0.0.1":
            return "http://localhost:8081";
            
        case "donate-gifts.com":
            return "https://donate-gifts.com";

        case "dev.donate-gifts.com":
            return "https://dev.donate-gifts.com"
    
        default:
            return window.location.hostname
    }
}