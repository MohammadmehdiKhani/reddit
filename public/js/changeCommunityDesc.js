$('#changeCommunityDesc-frm').on('submit', (e) => validateChangeComDescForm(e));

function validateChangeComDescForm(e) {
    e.preventDefault();

    var formIsValid = true;

    var newName = $("#new-com-desc-ipt").val().trim();

    var title = $("#new-com-desc-ipt");
    var titleErr = $("#new-com-desc-fdbErr");
    var titleSuc = $("#new-com-desc-fdbSuc");

    if (!newName) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New description cannot be empty!");
        formIsValid = false;
    } else if (newName.length < 5) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New description length should at least 5 character!");
        formIsValid = false;
    } else if (newName.length > 1000) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New description length should at most 1000 character!");
        formIsValid = false;
    }

    if (formIsValid) {

        // console.log($("#changeCommunity-frm"))

        $.ajax({
            url: $("#changeCommunityDesc-frm").attr("action"),
            type: "POST",
            data: {description: newName},
            success: function (res) {
                title.removeClass("is-invalid").addClass("is-valid");
                titleSuc.html("Community description changed successfully!");
                $("#community-desc-text").text("Description: " + newName)
            }
        })
    }
}