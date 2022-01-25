$('#changeUsername-frm').on('submit', (e) => validateChangeUsernameForm(e));

function validateChangeUsernameForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var oldUsername = $("#old-username-ipt").val();
    var newUsername = $("#new-username-ipt").val().trim();


    var title = $("#new-username-ipt");
    var titleErr = $("#new-username-fdbErr");
    if (!newUsername) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username cannot be empty!");
        formIsValid = false;
    } else if (newUsername.length < 5) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username length should at least 5 character!");
        formIsValid = false;
    } else if (newUsername === oldUsername) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New username should not be same as the current one!");
        formIsValid = false;
    }

    if (formIsValid) {
        document.getElementById("changeUsername-frm").submit();
    }
}