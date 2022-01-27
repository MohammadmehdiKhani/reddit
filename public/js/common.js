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
        url: `/api/communities`,
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
    console.log(postId);
})

function getPostIdFromElement(element) {
    let isRoot = element.hasClass("post");
    let rootElement = isRoot == true ? element : element.closest(".post");
    let postId = rootElement.data().id;
    return postId;
}

$(document).on("click", ".btn-join-community", (event) => {

    let community_id = $(event.currentTarget).attr('community-id')
    console.log("JOIN "+ community_id)


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
    console.log("Unjoin "+ community_id)



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