$('#changeEmail-frm').on('submit', (e) => validateChangeEmailForm(e));

function validateChangeEmailForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var oldEmail = $("#old-email-ipt").val();
    var newEmail = $("#new-email-ipt").val().trim();


    var title = $("#new-email-ipt");
    var titleErr = $("#new-email-fdbErr");
    var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;


    if (!newEmail) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New email cannot be empty!");
        formIsValid = false;
    } else if (newEmail === oldEmail) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New email should not be same as the current one!");
        formIsValid = false;
    } else if (!pattern.test(newEmail)){
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New email format is incorrect!");
        formIsValid = false;
    }

    if (formIsValid) {
        document.getElementById("changeEmail-frm").submit();
    }
}