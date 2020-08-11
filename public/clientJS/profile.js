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

    $("#wishCardForm").submit(function (e) {
        e.preventDefault();
        var fName = $("#fName").val();
        var lName = $("#lName").val();
        var email = $("#birthday").val();
        var interest = $("#interest").val();
        var item = $("#wishItem").val();
        var price = $("#price").val();
        var link = $("#itemLink").val();
        var story = $("#story").val();
        var img = $("#imgInp");

        $.post("/wishcards", {
            fName,
            lName,
            email,
            interest,
            item,
            price,
            link,
            story,
            img
        }, function (data, status, xhr) {
            if (!data.success) {
                alert(data.msg);
            } else {
                location.replace(data.redirectURL);
            }
        });

    });

});