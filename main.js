console.log("Main.js start");
var printHere = document.getElementById("print");



document.getElementById("luo").onclick = function () {
    var areaSelected = document.getElementById("area").value;
    var typeSelected = document.getElementById("type").value;
    var perPage = document.getElementById("perPage").value;
    console.log("Area number " + areaSelected);
    console.log("Type selected " + typeSelected);
    console.log("Posts per page: " + perPage);
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://www.'+ areaSelected +'.fi/wp-json/wp/v2/' + typeSelected +'?per_page='+ perPage);
    ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var data = JSON.parse(ourRequest.responseText);
        createHTML(data);
        //console.log(data);
    } else {
        console.log("We connected to the server, but it returned an error.");
    }
    };

    ourRequest.onerror = function() {
    console.log("Connection error");
    };

    ourRequest.send();

    function createHTML(data){
    console.log("CreateHTML function called");
    var htmlString = '';
        for (i=0;i<data.length;i++){
    htmlString += '<h2><a href ='+ data[i].link +'>' + data[i].title.rendered +'</a>'+'</h2>';
    htmlString += data[i].content.rendered;
    }
    printHere.innerHTML = htmlString;
    }
}

