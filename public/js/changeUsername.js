$('#changeUsername-frm').on('submit', (e) => validateChangeUsernameForm(e));

function validateChangeUsernameForm(e) {
    console.log("HERE")

    e.preventDefault();
    var formIsValid = true;

    var oldUsername = $("#old-username-ipt").val();
    var newUsername = $("#new-username-ipt").val().trim();


    var title = $("#new-username-ipt");
    var titleErr = $("#new-username-fdbErr");
    if (!newUsername){
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username cannot be empty!");
        formIsValid = false;
    }else if (newUsername.length < 5) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username length should at least 5 character!");
        formIsValid = false;
    } else if (newUsername === oldUsername){
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username should not be same as the current one!");
        formIsValid = false;
    }

    if (formIsValid) {
        document.getElementById("changeUsername-frm").submit();
    }

    // if (!username.val()) {
    //     username.removeClass("is-valid").addClass("is-invalid");
    //     usernameErr.html("Username is required");
    //     formIsValid = false;
    // }
    // else if (username.val().length < 5) {
    //     username.removeClass("is-valid").addClass("is-invalid");
    //     usernameErr.html("Username length is at least 5 character");
    //     formIsValid = false;
    // }
    // else {
    //     username.removeClass("is-invalid").addClass("is-valid");
    // }

    // var password = $("#password-ipt");
    // var passwordErr = $("#password-fdbErr");
    // if (!password.val()) {
    //     password.removeClass("is-valid").addClass("is-invalid");
    //     passwordErr.html("Password is required");
    //     formIsValid = false;
    // }
    // else if (password.val().length < 5) {
    //     password.removeClass("is-valid").addClass("is-invalid");
    //     passwordErr.html("Password length is at least 5 character");
    //     formIsValid = false;
    // }
    // else {
    //     password.removeClass("is-invalid").addClass("is-valid");
    // }
    //
    // var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // var email = $("#email-ipt");
    // var emailErr = $("#email-fdbErr");
    // if (!email.val()) {
    //     email.removeClass("is-valid").addClass("is-invalid");
    //     emailErr.html("Email is required");
    //     formIsValid = false;
    // }
    // else if (!pattern.test(email.val())) {
    //     email.removeClass("is-valid").addClass("is-invalid");
    //     emailErr.html("Email format is incorrect");
    //     formIsValid = false;
    // }
    // else if (email.val().length < 5) {
    //     email.removeClass("is-valid").addClass("is-invalid");
    //     emailErr.html("Email length is at least 5 character");
    //     formIsValid = false;
    // }
    // else {
    //     email.removeClass("is-invalid").addClass("is-valid");
    // }
    //
    // if (formIsValid) {
    //     document.getElementById("createUser-frm").submit();
    // }
}