$('#changeCommunityName-frm').on('submit', (e) => validateChangeComNameForm(e));

function validateChangeComNameForm(e) {
    e.preventDefault();


    var formIsValid = true;

    var newName = $("#new-com-name-ipt").val().trim();

    var title = $("#new-com-name-ipt");
    var titleErr = $("#new-com-name-fdbErr");
    var titleSuc = $("#new-com-name-fdbSuc");

    if (!newName) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New name cannot be empty!");
        formIsValid = false;
    } else if (newName.length < 5) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New name length should at least 5 character!");
        formIsValid = false;
    } else if (newName.length > 100) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("New name length should at most 100 character!");
        formIsValid = false;
    }

    if (formIsValid) {

        // console.log($("#changeCommunity-frm"))

        $.ajax({
            url: $("#changeCommunityName-frm").attr("action"),
            type: "POST",
            data: {name: newName},
            success: function (res) {
                title.removeClass("is-invalid").addClass("is-valid");
                titleSuc.html("Community name changed successfully!");
                $("#community-name-text").text(newName)
            }
        })
    }
}