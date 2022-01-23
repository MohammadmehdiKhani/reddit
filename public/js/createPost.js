$('#createPost-frm').on('submit', (e) => validateCreatePostForm(e));

function validateCreatePostForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var selectedCommunity = $("#community-dpx").find(":selected");
    if (!selectedCommunity.val()) {
        $("#community-dpx").removeClass("is-valid").addClass("is-invalid");
        $("#community-fdbErr").html("Community is required");
        formIsValid = false;
    }
    else {
        $("#community-dpx").removeClass("is-invalid").addClass("is-valid");
    }

    var title = $("#title-ipt");
    var titleErr = $("#title-fdbErr");
    if (!title.val()) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("Title is required");
        formIsValid = false;
    }
    else if (title.val().length < 5) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("Title length is at least 5 character");
        formIsValid = false;
    }
    else {
        title.removeClass("is-invalid").addClass("is-valid");
    }

    var body = $("#body-tar");
    var bodyErr = $("#body-fdbErr");
    if (!body.val()) {
        body.removeClass("is-valid").addClass("is-invalid");
        bodyErr.html("Body is required");
        formIsValid = false;
    }
    else if (body.val().length < 5) {
        body.removeClass("is-valid").addClass("is-invalid");
        bodyErr.html("Body length is at least 5 character");
        formIsValid = false;
    }
    else {
        body.removeClass("is-invalid").addClass("is-valid");
    }

    if (formIsValid) {
        //$("#createPost-btn").prop("disabled", true);
        document.getElementById("createPost-frm").submit();
    }
}