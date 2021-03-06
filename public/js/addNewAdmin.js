$('#addAdmin-frm').on('submit', (e) => bringUsersList(e));

function bringUsersList(e) {
    e.preventDefault();
    $('#search-result').empty()



    if ($("#new-admin-ipt").val().trim() !== ""){
        // document.getElementById("addAdmin-frm").submit();

        var community_id = $('#addAdmin-frm').attr("community_id")

        $.ajax({
            url: $('#addAdmin-frm').attr("action"),
            type: "POST",
            data: {
                searchInput:  $("#new-admin-ipt").val().trim()
            },
            dataType: 'JSON',
            success: function (res) {
                console.log(res)
                // console.log($('#addAdmin-frm'))
                // alert(res)


                var parent_div= document.getElementById('search-result');
                $('#search-result').empty()
                res.forEach(item=>{
                    var div = document.createElement('div')
                    div.className = "input-group justify-content-between list-group-item mb-2"
                    var p = document.createElement('p');
                    var btn = document.createElement('button');
                    p.textContent = item.username;
                    p.className = "align-baseline"
                    if (item.adminState === "isNotAdmin") {
                        btn.textContent = "Make admin"
                        btn.className = "btn btn-success rounded btn-community-add-admin"
                        btn.id = "btn-"+item._id
                        btn.setAttribute("community-id",community_id)
                        btn.setAttribute("user-id", item._id)
                        btn.setAttribute("user-name", item.username)
                    } else if (item.adminState === "isAdmin"){
                        btn.textContent = "Revoke admin"
                        btn.className = "btn btn-danger rounded btn-community-remove-admin"
                        btn.id = "btn-"+item._id
                        btn.setAttribute("community-id",community_id)
                        btn.setAttribute("user-id", item._id)
                        btn.setAttribute("user-name", item.username)
                    } else {
                        btn.className = "btn btn-dark rounded"
                        $('.btn-dark').prop('disabled', true);
                        btn.textContent = "Owner"
                    }
                    div.appendChild(p);
                    div.appendChild(btn);
                    parent_div.appendChild(div);
                })
            }
        })
    }

}
