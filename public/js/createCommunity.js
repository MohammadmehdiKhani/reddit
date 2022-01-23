$('#createCommunity-frm').on('submit', (e) => validateCreateCommunityForm(e));

function validateCreateCommunityForm(e) {
    e.preventDefault();
    var formIsValid = true;

    var name = $("#communityName-ipt");
    var nameErr = $("#communityName-fdbErr");
    if (!name.val()) {
        name.removeClass("is-valid").addClass("is-invalid");
        nameErr.html("Name is required");
        formIsValid = false;
    }
    else if (name.val().length < 5) {
        name.removeClass("is-valid").addClass("is-invalid");
        nameErr.html("Name length is at least 5 character");
        formIsValid = false;
    }
    else {
        name.removeClass("is-invalid").addClass("is-valid");
    }

    var description = $("#description-ipt");
    var descriptionErr = $("#description-fdbErr");
    if (!description.val()) {
        description.removeClass("is-valid").addClass("is-invalid");
        descriptionErr.html("Description is required");
        formIsValid = false;
    }
    else if (description.val().length < 5) {
        description.removeClass("is-valid").addClass("is-invalid");
        descriptionErr.html("Description length is at least 5 character");
        formIsValid = false;
    }
    else {
        description.removeClass("is-invalid").addClass("is-valid");
    }

    if (formIsValid) {
        //$("#createPost-btn").prop("disabled", true);
        document.getElementById("createCommunity-frm").submit();
    }
}