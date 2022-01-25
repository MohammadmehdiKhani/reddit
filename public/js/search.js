$('#search_bar').on('submit', (e) => search(e));

function search(e) {
    e.preventDefault();

    if ($("#search_bar_input").val().trim() !== ""){
        document.getElementById("search_bar").submit();
    }

}
