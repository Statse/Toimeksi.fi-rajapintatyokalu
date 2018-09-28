console.log("Main.js start");
var printHere = document.getElementById("print");



document.getElementById("luo").onclick = function () {
    var serviceSelected = document.getElementById("service").value;
    var typeSelected = document.getElementById("type").value;
    var perPage = document.getElementById("perPage").value;
    var area = document.getElementById("area").value;
    var village = document.getElementById("village").value;
    var order = document.getElementById("order").value;
    var orderedBy = document.getElementById("orderby").value;
    console.log("Palvelu: " + serviceSelected);
    console.log("Noston tyyppi: " + typeSelected);
    console.log("Nostojen määrä: " + perPage);
    console.log("Kylää haettu: " + village);
    //getVillage(village);
   
   // console.log(getVillage(village));

    var reqURL = requestedURL();
    console.log("*==*makeRestApiRequest*==*");
    makeRestApiRequest(reqURL, createHTML);


    createJavaScript(reqURL); 
 
    function requestedURL(){
      var requestURL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/' + typeSelected + postPerPage(perPage) + getArea(area) + orderBy(orderedBy) + ordered(order);
      console.log(requestURL);
      return requestURL;
    }

    function orderBy(orderedBy){
         return "&orderby=" + orderedBy; 
    }

    function ordered(order){
        if (order=="asc"){
            return "&order=asc";
        } else {
            return "&order=desc";
        }
    }

    function postPerPage(perPage){
        if (perPage>100){
            perPage = 100;
            // console.log("Rajapinnasta ei voi nostaa enempää kuin 100 kohdetta.");
            // console.log("Asetetaan nostettujen kohteiden määräksi 100.");
        }
        var pages = '?per_page=' + perPage;
        return pages;
    }

    function getArea(area){
        if (area==="none"){
            //console.log("Aluetta ei valittu");
            var empty ='';
            return empty;
        } else {
            //do other stuff
            //console.log(area + " alue valittu");
            var alue = '&tm_sote-alue=' + area;
            return alue;
        }
    }

    //annetaan hautua
    function getVillage(village){
        var a;
        console.log("2. Haetaan kylää/kaupunginosaa " + village);
        var villageURL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/tm_municipality?search=' + village;
        console.log("3. Haetaan osoitteesta: " + villageURL);

        var villageRequest = new XMLHttpRequest();
        villageRequest.open('GET', villageURL);
        villageRequest.onload = function() {
        if (villageRequest.status >= 200 && villageRequest.status < 400) {
            var data = JSON.parse(villageRequest.responseText);
            console.log(data);
            a = parseVillageSearch(data);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
        };
    
        villageRequest.onerror = function() {
            console.log("Connection error");
        };
    
        villageRequest.send();
        console.log("Asetetaan kylä url osoitteeseen: " + a);
        if (a==undefined){

        } else {
            var municipality = "&tm_municipality="+a;
            return municipality;
        }

        
    console.log("*=====*getVillage function call completed*=====*");
    }

    function makeRestApiRequest(requestURL){
        //url to request, function to handle the json data
        var ourRequest = new XMLHttpRequest();
        ourRequest.open('GET', requestURL);
        //console.log("URL requested: " + requestURL)
        ourRequest.onload = function() {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            var data = JSON.parse(ourRequest.responseText);
            console.log(data);
            createHTML(data);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
        };
    
        ourRequest.onerror = function() {
            console.log("Connection error");
        };
    
        ourRequest.send();
    }

    //unohda tämä tee muut ensin. 
    function parseVillageSearch(data){
        console.log("parseVillageSearch started");
        var returnData;
            for (i=0;i<data.length;i++){
                if (data[i].name.toUpperCase() == village.toUpperCase()){
                    console.log("Kylä/kaupungin osa löytyi!");
                    console.log("Kylän id on = "+ data[i].id);   
                    returnData =  data[i].id;
            } 
        }
    }

    function createHTML(data){
    var htmlString = '';
        for (i=0;i<data.length;i++){
    htmlString += '<h2><a href ='+ data[i].link +'>' + data[i].title.rendered +'</a>'+'</h2>';
    htmlString += data[i].date;
    htmlString += data[i].content.rendered;
    }
    printHere.innerHTML = htmlString;
    }


    function createJavaScript(content){
        var print = document.getElementById("js");
        var code = "";
        code +=  "<pre>"; 
        code +=  "<code>"; 
        code +=  "var printHere = document.getElementById('print');<br>";
        code +=  "var ourRequest = new XMLHttpRequest();<br> ourRequest.open('GET', '"+content+"');<br>ourRequest.onload = function(){<br>if (ourRequest.status >= 200 && ourRequest.status < 400) {<br>var data = JSON.parse(ourRequest.responseText);<br>console.log(data);<br>createHTML(data);<br>} else {<br>console.log('We connected to the server, but it returned an error.');<br> }<br>};<br>ourRequest.onerror = function() {<br>console.log('Connection error');<br>};<br>ourRequest.send();";

        code +=  "function ";
        code +=  "createHTML(data){ <br>";
        code +=  "var htmlString = '';<br>";
        code +=  "for (i=0;i&ltdata.length;i++){<br>";
        code +=  "htmlString += '<span><</span>h2><span><</span>a href ='+ data[i].link +'>' + data[i].title.rendered +'<span><</span>/a>'+'</h2>';<br>";
        code +=  "htmlString += data[i].date;<br>";
        code +=  "htmlString += data[i].content.rendered;<br>";
        code +=  "}<br>";
        code +=  "printHere.innerHTML = htmlString;<br>";
        code +=  "}<br>";
        code +=  "</code>";
        code +=  "</pre>";

        print.innerHTML = "";
        print.innerHTML += code;
    }
}

