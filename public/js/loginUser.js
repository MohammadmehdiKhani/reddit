$('#loginUser-frm').on('submit', (e) => validateLoginUserForm(e));

function validateLoginUserForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var username = $("#username-ipt");
    var usernameErr = $("#username-fdbErr");
    if (!username.val()) {
        username.removeClass("is-valid").addClass("is-invalid");
        usernameErr.html("Username is required");
        formIsValid = false;
    }
    else if (username.val().length < 5) {
        username.removeClass("is-valid").addClass("is-invalid");
        usernameErr.html("Username length is at least 5 character");
        formIsValid = false;
    }
    else {
        username.removeClass("is-invalid").addClass("is-valid");
    }

    var password = $("#password-ipt");
    var passwordErr = $("#password-fdbErr");
    if (!password.val()) {
        password.removeClass("is-valid").addClass("is-invalid");
        passwordErr.html("Password is required");
        formIsValid = false;
    }
    else if (password.val().length < 5) {
        password.removeClass("is-valid").addClass("is-invalid");
        passwordErr.html("Password length is at least 5 character");
        formIsValid = false;
    }
    else {
        password.removeClass("is-invalid").addClass("is-valid");
    }

    if (formIsValid) {
        document.getElementById("loginUser-frm").submit();
    }
}