$(document).ready(function () {
     /*----------------------------------------
    @desc   custom handle the <input type="file"> default appearance,
            changes the button text when photo is chosen,
            grabs the user's file path,
            previews the chosen photo in a thumbnail. 
    ------------------------------------------*/
    var SITE = SITE || {};
    SITE.fileInputs = function () {
        var $this = $(this),
            $val = $this.val(),
            valArray = $val.split('\\'),
            newVal = valArray[valArray.length - 1],
            $button = $this.siblings('.upload-btn'),
            $fakeFile = $this.siblings('.file-holder');
        if (newVal !== '') {
            $button.text('Photo Chosen');
            if ($fakeFile.length === 0) {
                $button.after('<span class="file-holder">' + newVal + '</span>');
            } else {
                $fakeFile.text(newVal);
            }
        }
    };
    $('.file-wrapper input[type=file]').bind('change focus click', SITE.fileInputs);

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var tmppath = URL.createObjectURL(event.target.files[0]);
            reader.onload = function (e) {
                $('#img-uploaded').attr('src', e.target.result);
                $('input.img-path').val(tmppath);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".uploader").change(function () {
        readURL(this);
    });


    // $("#wishCardForm").submit(function (e) {
    //     e.preventDefault();
    //     var fName = $("#fName").val();
    //     var lName = $("#lName").val();
    //     var birthday = $("#birthday").val();
    //     var interest = $("#interest").val();
    //     var item = $("#wishItem").val();
    //     var price = $("#price").val();
    //     var link = $("#itemLink").val();
    //     var story = $("#story").val();
    //     var img = $("#imgInp");

    //     $.post("/wishcards", {
    //         fName,
    //         lName,
    //         birthday,
    //         interest,
    //         item, 
    //         price, 
    //         link,
    //         story,
    //         img
    //       }, function(data, status, xhr) {
    //           if (!data.success) {
    //             alert(data.msg);
    //           } else {
    //             location.replace(data.redirectURL);
    //           }
    //     });

    // });

});