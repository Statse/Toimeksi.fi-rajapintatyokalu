var printHere = document.getElementById("print");



document.getElementById("luo").onclick = function () {
    var serviceSelected = document.getElementById("service").value;
    var typeSelected = document.getElementById("type").value;
    var perPage = document.getElementById("perPage").value;
    var area = document.getElementById("area").value;
    var village = document.getElementById("village").value;
    var kunta = document.getElementById("kunta").value;
    var order = document.getElementById("order").value;
    var orderedBy = document.getElementById("orderby").value;

    var reqURL = requestedURL();
    makeRestApiRequest(reqURL, createHTML);
    createJavaScript(reqURL); 

   
 
    function requestedURL(){
      var requestURL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/' + typeSelected + postPerPage(perPage) + getArea(area) + orderBy(orderedBy) + ordered(order) +  getKunta(kunta) + getVillage(village);
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
            alert("Rajapinnasta ei voi nostaa enempää kuin 100 kohdetta. Asetetaan määräksi 100.")
        }
        var pages = '?per_page=' + perPage;
        return pages;
    }

    function getArea(area){
        if (area==="none"){
            var empty ='';
            return empty;
        } else {
            var alue = '&tm_sote-alue=' + area;
            return alue;
        }
    }

    function getKunta(kunta){
        var a;
        var URL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/tm_municipality?search=' + kunta;

        var theRequest = new XMLHttpRequest();
        theRequest.open('GET', URL, false);
        theRequest.onload = function() {
        if (theRequest.status >= 200 && theRequest.status < 400) {
            var data = JSON.parse(theRequest.responseText);
            console.log(data);
            a = parseSearch(data, kunta);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
        };
    
        theRequest.onerror = function() {
            console.log("Connection error");
            alert("Connection error.")
        };
    
        theRequest.send();  
        
        if (theRequest.readyState == 4){
            if (a==undefined){
                return '';
            } else {
                console.log("Asetetaan kylä url osoitteeseen: " + a);
                var municipality = "&tm_municipality="+a;
                return municipality;
            }
        }
    }

    
    function getVillage(kunta){ 
        var a;
        var URL = 'https://www.'+ serviceSelected +'.fi/wp-json/wp/v2/tm_village?search=' + kunta;

        var theRequest = new XMLHttpRequest();
        theRequest.open('GET', URL, false);
        theRequest.onload = function() {
        if (theRequest.status >= 200 && theRequest.status < 400) {
            var data = JSON.parse(theRequest.responseText);
            console.log(data);
            a = parseSearch(data, kunta);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
        };
    
        theRequest.onerror = function() {
            console.log("Connection error");
            alert("Connection error.")
        };
    
        theRequest.send();  
        
        if (theRequest.readyState == 4){
            if (a==undefined){
                return '';
            } else {
                var kyla = "&tm_village="+a;
                return kyla;
            }
        }
    }


    function makeRestApiRequest(requestURL){
        //url to request, function to handle the json data
        var ourRequest = new XMLHttpRequest();
        ourRequest.open('GET', requestURL);
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

    function parseSearch(data, passedValue){//search for area
        var returnData;
            for (i=0;i<data.length;i++){
                if (data[i].name.toUpperCase() == passedValue.toUpperCase()){
                    returnData =  data[i].id;
            } 
        }
        return returnData;
    }

    function createHTML(data){
    var htmlString = '';
        for (i=0;i<data.length;i++){
    htmlString += '<h2><a href ='+ data[i].link +'>' + data[i].title.rendered +'</a>'+'</h2>';
    htmlString += 'Aika: ' + data[i].date;
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

