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