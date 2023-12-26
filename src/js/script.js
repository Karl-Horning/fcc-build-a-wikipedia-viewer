// searchbar
$(document).ready(function () {
    $("#btn-search").click(function () {
        var $searchBackground = $(".search-background");
        var $footer = $(".footer");
        var $wiki = $(".wiki");
        var $wikiArticles = $("#wikiArticles");
        var query = $("#q").val();

        if (query == "") query = "nothing";
        var wikiApiUrl =
            "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
            query +
            "&format=json&callback=?";

        // Remove previous query
        $wikiArticles.text("");

        // close the autocomplete so it's not in the users way if they wrote their own query
        $("#q").autocomplete("close");

        $wiki.css("min-height", "80vh");
        $searchBackground.css("background-color", "#eae3ea");
        $searchBackground.css("border-bottom", "1px solid #ccc6cc");
        $searchBackground.css("margin-bottom", "20px");
        $searchBackground.css("margin-top", "0");
        $footer.css("background-color", "#eae3ea");
        $footer.css("border-top", "1px solid #ccc6cc");
        $footer.css("margin-top", "20px");
        $footer.css("padding", "20px 0");

        var wikiRequestTimeout = setTimeout(function () {
            $wikiArticles.text(
                "Sorry, the Wikipedia articles cannot be loaded as your request timed out."
            );
        }, 8000);

        $.ajax({
            dataType: "jsonp",
            url: wikiApiUrl,
            type: "GET",
        })
            .done(function (data) {
                wikiArticlesLength = data[1].length;

                if (wikiArticlesLength == 0) {
                    $wikiArticles.append(
                        "Sorry, <b>" + query + "</b> returned no results."
                    );
                } else {
                    for (var i = 0; i < wikiArticlesLength; i++) {
                        var articleTitle = data[1][i];
                        var articleSnippet = data[2][i];
                        var articleUrl = data[3][i];
                        $(
                            '<li><h3><a href="' +
                                articleUrl +
                                '" target="blank">' +
                                articleTitle +
                                '</a></h3><p class="url">' +
                                articleUrl +
                                "</p><p>" +
                                articleSnippet +
                                "</p></li>"
                        ).appendTo($wikiArticles);
                    }
                    $(
                        '<li><h3><a href="https://en.wikipedia.org/w/index.php?title=Special:Search&profile=default&fulltext=1&search=' +
                            query +
                            '" target="blank">See all search results for <b>' +
                            query +
                            "</b> on Wikipedia...</a></h3></li>"
                    ).appendTo($wikiArticles);
                }
                clearTimeout(wikiRequestTimeout);
            })
            .fail(function (errorMsg) {
                $wikiArticles.text(
                    "Sorry, the Wikipedia articles cannot be loaded as the request failed."
                );
                console.log(errorMsg);
            });
    });
    return false;
});

// autocomplete
$("#q").autocomplete({
    source: function (request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                action: "opensearch",
                format: "json",
                search: request.term,
            },
            success: function (data) {
                response(data[1]);
            },
        });
    },
});
