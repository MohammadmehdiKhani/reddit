$(document).on("click", ".btn-createPost", (event) => {

    let title = $("#postTitle").val();
    let postsList = $("#postsList");
    let li = $("<li>");
    let div = $("<div>");
    li.html(div);
    $.ajax({
        url: `/api/posts`,
        type: "POST",
        data: { title: title },
        success: (returnedData) => {
            li.html(returnedData);
            postsList.append(li);
        }
    })
})

/*
$(document).ready(() => {

    let communitiesList = $("#myCommunities");

    $.ajax({
        url: `/api/communities`,
        type: "GET",
        success: (returnedData) => {

            for (const c of returnedData) {
                const name = c.name;
                const id = c._id;
                let a = $('<a/>', {
                    id: `${id}`,
                    class: 'list-group-item list-group-item-action',
                    html: `${name}`,
                    href: `/communities/` + `${name}`
                });
                communitiesList.append(a);
            }
        }
    })
})
*/

// $(document).ready(() => {
//     $.ajax({
//         url: `/api/communities`,
//         type: "GET",
//         success: (returnedData) => {
//             var myCommunities = returnedData;
//         }
//     })
// })



$(document).ready(() => {

    let communitiesDropBox = $("#community-dpx");

    $.ajax({
        url: `/api/communities/isJoined`,
        type: "GET",
        success: (returnedData) => {

            for (const c of returnedData) {
                const name = c.name;
                const value = c._id;
                let a = $('<option/>', {
                    html: `${name}`,
                    value: `${value}`
                });
                communitiesDropBox.append(a);
            }
        }
    })
})

$(document).on("click", ".like-btn", (event) => {
    let element = $(event.currentTarget);
    let postId = getPostIdFromElement(element);

    $.ajax({
        url: `/api/posts/like/${postId}`,
        data: {},
        type: "PUT",
        success: result => {
            if (result.liked) {
                element.removeClass("btn-outline-primary").addClass("btn-danger");
            }
            else {
                element.removeClass("btn-danger").addClass("btn-outline-primary");
            }

            element.children("span").html(`Like | ${result.likeCount}`);
        }
    });
})

function getPostIdFromElement(element) {
    let isRoot = element.hasClass("post");
    let rootElement = isRoot == true ? element : element.closest(".post");
    let postId = rootElement.data().id;
    return postId;
}

$(document).ready(function () {
    $('#com-add-admin-dialog').hide()
    $('#com-change-name-dialog').hide()
    $('#com-change-desc-dialog').hide()

    $('#com-add-admin-btn').click(function () {
        if ($("#com-add-admin-btn").hasClass("btn-outline-primary")) {
            $('#com-add-admin-dialog').show()
            $('#com-change-name-dialog').hide()
            $('#com-change-desc-dialog').hide()

            $("#com-add-admin-btn").removeClass("btn-outline-primary").addClass("btn-primary");
            $("#com-change-name").removeClass("btn-primary").addClass("btn-outline-primary");
            $("#com-change-desc").removeClass("btn-primary").addClass("btn-outline-primary");
        } else {
            $('#com-add-admin-dialog').hide()

            $("#com-add-admin-btn").removeClass("btn-primary").addClass("btn-outline-primary");
        }
    });


    $('#com-change-name').click(function () {

        if ($("#com-change-name").hasClass("btn-outline-primary")) {
            $('#com-change-name-dialog').show()
            $('#com-add-admin-dialog').hide()
            $('#com-change-desc-dialog').hide()

            $("#com-change-name").removeClass("btn-outline-primary").addClass("btn-primary");
            $("#com-add-admin-btn").removeClass("btn-primary").addClass("btn-outline-primary");
            $("#com-change-desc").removeClass("btn-primary").addClass("btn-outline-primary");
        } else {
            $('#com-change-name-dialog').hide()

            $("#com-change-name").removeClass("btn-primary").addClass("btn-outline-primary");
        }
    });


    $('#com-change-desc').click(function () {


        if ($("#com-change-desc").hasClass("btn-outline-primary")) {
            $('#com-change-desc-dialog').show()
            $('#com-add-admin-dialog').hide()
            $('#com-change-name-dialog').hide()

            $("#com-change-desc").removeClass("btn-outline-primary").addClass("btn-primary");
            $("#com-change-name").removeClass("btn-primary").addClass("btn-outline-primary");
            $("#com-add-admin-btn").removeClass("btn-primary").addClass("btn-outline-primary");
        } else {
            $('#com-change-desc-dialog').hide()

            $("#com-change-desc").removeClass("btn-primary").addClass("btn-outline-primary");
        }
    });

});

$(document).on("click", ".btn-join-community", (event) => {

    let community_id = $(event.currentTarget).attr('community-id')
    console.log("JOIN " + community_id)


    $.ajax({
        url: `/communities/community/${community_id}/join`,
        type: "POST",
        success: function (res) {
            $("#join-button").removeClass("btn-outline-primary").addClass("btn-primary");
            $("#join-button").removeClass("btn-join-community").addClass("btn-unjoin-community");
            $("#join-button span").text("Joined");
        }
    })
})



$(document).on("click", ".btn-unjoin-community", (event) => {

    let community_id = $(event.currentTarget).attr('community-id')
    console.log("Unjoin " + community_id)



    $.ajax({
        url: `/communities/community/${community_id}/unjoin`,
        type: "POST",
        success: function (res) {
            $("#join-button").removeClass("btn-primary").addClass("btn-outline-primary");
            $("#join-button").removeClass("btn-unjoin-community").addClass("btn-join-community");
            $("#join-button span").text("Join");
        }
    })
})


$(document).on("click", ".btn-remove-post", (event) => {
    let post_id = $(event.currentTarget).attr('post_id')
    let community_id = $(event.currentTarget).attr('community_id')

    $.ajax({
        url: `/posts/remove`,
        type: "POST",
        data: {
          postId : post_id,
            communityId: community_id
        },
        success: function (res) {
            $(`#post-${post_id}`).fadeOut(500, function(){ $(this).remove();});
        }
    })

});




$(document).on("click", ".btn-community-add-admin", (event) => {

    let community_id = $(event.currentTarget).attr('community-id')
    let user_id = $(event.currentTarget).attr('user-id')
    let user_name = $(event.currentTarget).attr('user-name')

    console.log("ADD " + community_id + " " + user_id)

    $.ajax({
        url: `/communities/community/make_admin`,
        type: "POST",
        data: {
            community_id: community_id,
            user_id: user_id
        },
        success: function (res) {
            $("#btn-"+user_id).text("Revoke admin")
            $("#btn-"+user_id).removeClass("btn-success").addClass("btn-danger")
            $("#btn-"+user_id).removeClass("btn-community-add-admin").addClass("btn-community-remove-admin")


            let parent_div= document.getElementById('myCommunities');
            let a = document.createElement('a');
            a.className = "list-group-item list-group-item-action"
            a.id = "admin-list-dynamic-"+user_id
            a.text = user_name
            parent_div.appendChild(a)
            // $("#admin-list-dynamic-"+user_id).text("hello")
        }
    })
})



$(document).on("click", ".btn-community-remove-admin", (event) => {

    let community_id = $(event.currentTarget).attr('community-id')
    let user_id = $(event.currentTarget).attr('user-id')
    console.log("REVOKE " + community_id + " " + user_id)

    $.ajax({
        url: `/communities/community/revoke_admin`,
        type: "POST",
        data: {
            community_id: community_id,
            user_id: user_id
        },
        success: function (res) {
            $("#btn-"+user_id).text("Make admin")
            $("#btn-"+user_id).removeClass("btn-danger").addClass("btn-success")
            $("#btn-"+user_id).removeClass("btn-community-remove-admin").addClass("btn-community-add-admin")

            $(`#admin-list-dynamic-${user_id}`).remove()

        }
    })
})







$(document).on("click", ".send_comment", (event) => {
    // let post_id = $(event.currentTarget).attr('post_id')
    // let community_id = $(event.currentTarget).attr('community_id')

    let input = $('#submitComment-body').val().trim()
    let post_id = $(event.currentTarget).attr('post-id')


    let title = $("#submitComment-body");
    let titleErr = $("#submitComment-fdbErr");


    if (!input || input.length > 1000) {
        title.removeClass("is-valid").addClass("is-invalid");
        titleErr.html("Comments cannot be empty nor too big!");
    } else {
        title.removeClass("is-invalid").addClass("is-valid");
        titleErr.html("");

        $.ajax({
            url: `/posts/post/send_comment`,
            type: "POST",
            data: {
                postId : post_id,
                commentBody: input
            },
            success: function (res) {
                alert(100)
                // $(`#post-${post_id}`).fadeOut(500, function(){ $(this).remove();});
            }
        })

    }


});



function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if ((elapsed / 1000) < 30) return ' just now';

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}