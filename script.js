/*
1) mainpart+
2) get information from the form
3) create request+
4) get and handle resposne+
5) parse response to a  separate articles+
6) create a paragraph (put it to "#mainField")+
*/

//NY times api
var api_key = "fa4a4f9adc534cbfb37006bc43666d27"
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var searchTerm = "";

//optional key
var start_year, end_year;


var numberOfRecordsToRetrieve = 0;
var mainResponseObject;

$(document).ready(function() {
    $(".resultstyle").hide()
    console.log("Document ready to work!")
    $("#search_button").click(startSearch);
    $("#reset").click(cleanResultsField);
})

function retrieveDatafromHTML() {
    searchTerm = $("#search_term").val();
    if ($("#retrieve").val() > 10) {
        alert("No more than 10 recerds at once")
    }
    if ($("#retrieve").val() == "") {
        numberOfRecordsToRetrieve = 10;
    }
    else {
        numberOfRecordsToRetrieve = $("#retrieve").val()
    }
    console.log("SearchTerm: " + searchTerm);
    if ($("#startyear").val() == "") {
        start_year = "19000101";
    }
    else {
        start_year = $("#startyear").val() + "0101";

    }
    if ($("#endyear").val() == "") {
        end_year = "20171230";
    }
    else {
        console.log("New endyear");
        end_year = $("#endyear").val() + "1230";
    }


}

function startSearch() {
    //AJAX request
    $(".resultstyle").show()
    mainResponseObject = null;
    retrieveDatafromHTML();
    console.log("startSeact button activated");
    // url += '?' + $.param({
    //     'api-key': api_key,
    //     'q': searchTerm,
    //     'begin_date': start_year,
    //     'end_date': end_year,
    //     'fl': "web_url, snippet, lead_paragraph, headline, pub_date"
    // });

    $.ajax({
        url: url,
        data: {
            'api-key': api_key,
            'q': searchTerm,
            'begin_date': start_year,
            'end_date': end_year,
            'fl': "web_url, snippet, lead_paragraph, headline, pub_date"
        },
        method: 'GET',
    }).done(function(result) {
        mainResponseObject = result;
        var index = 0;
        console.log("Headline.main: " + result.response.docs[index].headline.main);
        console.log("Snippet: " + result.response.docs[index].snippet);
        console.log("Pub.date: " + result.response.docs[index].pub_date);
        console.log("Url: " + result.response.docs[index].web_url);
        createNewParagraph();
    }).fail(function(err) {
        throw err;
    });
}
//do not use it nowhere, but startSearch
function createNewParagraph() {
    console.log("createNewParagraph:");

    for (var i = 0; i < numberOfRecordsToRetrieve; i++) {
        var paragraph = $("<div>");

        paragraph.attr("class", "paragraphClass");
        var header3 = $("<h3>");

        header3.text(mainResponseObject.response.docs[i].headline.main);
        var innerParagraph = $("<p>");
        innerParagraph.text(mainResponseObject.response.docs[i].snippet);
        var linkUrl = $("<a />", {
            //id: "id5",
            name: "link",
            href: mainResponseObject.response.docs[i].web_url,
            text: "URL-link"
        });
        var pubDate = $("<p>");
        pubDate.text(mainResponseObject.response.docs[i].pub_date);

        paragraph.append(header3);
        paragraph.append(innerParagraph);
        paragraph.append(pubDate);
        paragraph.append(linkUrl);

        $("#mainField").append(paragraph);
    }
}

function cleanResultsField() {
    $("#mainField").html("");
    searchTerm = "";
    numberOfRecordsToRetrieve = 0;

}
