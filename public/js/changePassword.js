$('#changePassword-frm').on('submit', (e) => validateChangePasswordForm(e));

function validateChangePasswordForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var currentPassword = $("#current-password-ipt").val();
    var newPassword = $("#new-password-ipt").val();
    var newPasswordVer = $("#new-password-ver-ipt").val();


    var title1 = $("#current-password-ipt");
    var titleErr1 = $("#current-password-fdbErr");

    var title2 = $("#new-password-ipt");
    var titleErr2 = $("#new-password-fdbErr");

    var title3 = $("#new-password-ver-ipt");
    var titleErr3 = $("#new-password-ver-fdbErr");


    if (!currentPassword) {
        title1.removeClass("is-valid").addClass("is-invalid");
        titleErr1.html("Please enter your previous password!");
        formIsValid = false;
    }

    if (!newPassword) {
        title2.removeClass("is-valid").addClass("is-invalid");
        titleErr2.html("Please enter new password!");
        formIsValid = false;
    }

    if (!newPasswordVer) {
        title3.removeClass("is-valid").addClass("is-invalid");
        titleErr3.html("Please re-enter new password!");
        formIsValid = false;
    }

    if (newPassword && newPasswordVer) {
        if (newPasswordVer === newPassword) {
            if (newPassword.length < 5) {
                title2.removeClass("is-valid").addClass("is-invalid");
                titleErr2.html("Password length should be at least 5 character!");
                title3.removeClass("is-valid").addClass("is-invalid");
                titleErr3.html("Password length should be at least 5 character!");
                formIsValid = false;
            }
        } else {
            title2.removeClass("is-valid").addClass("is-invalid");
            titleErr2.html("Password doesn't match!");
            title3.removeClass("is-valid").addClass("is-invalid");
            titleErr3.html("Password doesn't match!");
            formIsValid = false;

        }
    }

    if (formIsValid) {
        document.getElementById("changePassword-frm").submit();
    }
}