console.log("Main.js start");
var printHere = document.getElementById("print");



document.getElementById("luo").onclick = function () {
    var serviceSelected = document.getElementById("service").value;
    var typeSelected = document.getElementById("type").value;
    var perPage = document.getElementById("perPage").value;
    var area = document.getElementById("area").value;
    var village = document.getElementById("village").value;
    console.log("Palvelu: " + serviceSelected);
    console.log("Noston tyyppi: " + typeSelected);
    console.log("Nostojen määrä: " + perPage);
    getVillage(village);
   
    var reqURL = requestedURL();
    makeRestApiRequest(reqURL, createHTML);

    function requestedURL(){
      var requestURL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/' + typeSelected + postPerPage(perPage) + getArea(area);
      //console.log(requestURL);
      return requestURL;
    }

    function postPerPage(perPage){
        if (perPage>100){
            perPage = 100;
            console.log("Rajapinnasta ei voi nostaa enempää kuin 100 kohdetta.");
            console.log("Asetetaan nostettujen kohteiden määräksi 100.");
        }
        var pages = '?per_page=' + perPage;
        return pages;
    }

    function getArea(area){
        if (area==="none"){
            console.log("Aluetta ei valittu");
            var empty ='';
            return empty;
        } else {
            //do other stuff
            console.log(area + " alue valittu");
            var alue = '&tm_sote-alue=' + area;
            return alue;
        }
    }

    function getVillage(village){
        console.log("Haetaan kylää/kaupunginosaa " + village);
        var villageURL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/tm_municipality?search=' + village;
        console.log("Haetaan osoitteesta: " + villageURL);
        var a = makeRestApiRequest(villageURL, parseVillageSearch);
        //console.log("Kylä/kaupunginosan id " + a);

        // var kunta = '&tm_municipality' + kunta;
        // return kunta; 
    }

    function makeRestApiRequest(requestURL, functionAfter){
        //url to request, function to handle the json data
        var ourRequest = new XMLHttpRequest();
        ourRequest.open('GET', requestURL);
        console.log("URL requested: " + requestURL)
        ourRequest.onload = function() {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            var data = JSON.parse(ourRequest.responseText);
            console.log(data);
            if (functionAfter !== undefined){
                console.log("Function after called")
                functionAfter(data);
            } else {
                console.log("Function after wast not called because function was not passed as parameter");
            }
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
        };
    
        ourRequest.onerror = function() {
            console.log("Connection error");
        };
    
        ourRequest.send();
    }

    function parseVillageSearch(data){
        console.log("parseVillageSearch started");
            for (i=0;i<data.length;i++){
                if (data[i].name == village){
                    console.log("Kylä/kaupungin osa löytyi!")
                    console.log("Kylän id on = "+ data[i].id);
                    return data[i].id;
                }
            }
        }

    function createHTML(data){
    console.log("Luodaan html nostoista...");
    var htmlString = '';
        for (i=0;i<data.length;i++){
    htmlString += '<h2><a href ='+ data[i].link +'>' + data[i].title.rendered +'</a>'+'</h2>';
    htmlString += data[i].content.rendered;
    }
    printHere.innerHTML = htmlString;
    }
}

