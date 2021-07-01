var jsonURL;
var jsonObject;
var responseSuccess = false;

var tableHead = "<table class='table table-sm table-striped fixed_header'><thead class='thead-dark'><tr><th scope='col' class='thSuburb'>Suburb</th><th scope='col' class='thVenue'>Venue</th><th scope='col' class='thAddress'>Address</th><th scope='col' class='thDate'>Date</th><th scope='col' class='thTime'>Time</th><th scope='col' class='thUpdate'>Last Updated</th><th scope='col' class='thAlert'>Alert</th><th scope='col' class='thAdvice'>Health Advice</th></tr></thead><tbody>";
var tableBody = "<tr><td class='tdSuburb' title='Suburb'>{{suburb}}</td><td class='tdVenue' title='Venue'>{{venue}}</td><td class='tdAddress' title='Address'>{{address}}</td><td class='tdDate' title='Date'>{{date}}</td><td class='tdTime' title='Time'>{{time}}</td><td class='tdUpdate' title='Last Update'>{{lastupdate}}</td><td class='tdAlert' title='Alert'>{{alert}}</td><td class='tdAdvice' title='Health Advice'>{{advice}}</td></tr>";
var tableFoot = "</tbody></table>";

// Load on Ready
// Load on Ready
// Load on Ready
// Load on Ready
// // https://codetonics.com/javascript/detect-document-ready/
// function ready(callbackFunction){
//   if(document.readyState != 'loading')
//     callbackFunction(event)
//   else
//     document.addEventListener("DOMContentLoaded", callbackFunction)
// }
// ready(event => {
//   console.log('DOM is ready.')
// })
// https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
// https://codetonics.com/javascript/detect-document-ready/
(function() {

  // console.log("DOM is Ready!");

  // var varURL = "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289";
  // var xmlhttp = new XMLHttpRequest();
  
  // xmlhttp.onreadystatechange = function() {    
  //   if (this.readyState == 4 && this.status == 200) {
  //     var jsonObj = JSON.parse(this.responseText);
  //     var covidResources = jsonObj.result.resources;
  //     // console.log(covidResources);
  //     covidResources.forEach(element => {
  //       if (element.format.trim().toLowerCase() == "json") {
  //         console.log(element.last_modified, element.url);
  //       } // END if JSON format
  //     }); // END FOREACH
  //   } // END if readyState
  // }; // END XML onReadyStateChange

  // xmlhttp.open("GET", varURL, true);
  // xmlhttp.send();
  
  loadSuburbButtons();
  getData();

})(); // END Load on Ready

// SUPPORT FUNCTIONS
// SUPPORT FUNCTIONS
// SUPPORT FUNCTIONS
// SUPPORT FUNCTIONS
function formatDate(dateString) {
  // const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var d = new Date(dateString);
  // var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  // var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  var datestring = dayName[d.getDay()] + " " + ("0" + d.getDate()).slice(-2) + " " + monthName[d.getMonth()] + " " + d.getFullYear();
  return datestring;
}

function findInfo2(dMonitor) {
  var out = "";
  var i;
  var counter = 0;
  var SearchSuburb = document.getElementById('suburb').value;
  var regex = new RegExp(SearchSuburb.trim(), "i");
  for(i = 0; i < dMonitor.length; i++) {
    if (dMonitor[i].Suburb.trim().search(regex) >= 0)
    {
      var tmpTableRow = tableBody.replace("{{suburb}}", dMonitor[i].Suburb);
          tmpTableRow = tmpTableRow.replace("{{venue}}", dMonitor[i].Venue);
          tmpTableRow = tmpTableRow.replace("{{address}}", dMonitor[i].Address);
          tmpTableRow = tmpTableRow.replace("{{date}}", formatDate(dMonitor[i].Date));
          tmpTableRow = tmpTableRow.replace("{{time}}", dMonitor[i].Time);
          tmpTableRow = tmpTableRow.replace("{{lastupdate}}", formatDate(dMonitor[i]['Last updated date']));
          tmpTableRow = tmpTableRow.replace("{{alert}}", dMonitor[i].Alert);
          tmpTableRow = tmpTableRow.replace("{{advice}}", dMonitor[i].HealthAdviceHTML);
      out += tmpTableRow;
      counter += 1;
    } // END if suburb match
  } // END for loop
  // console.log(counter);
  document.getElementById("id04").innerHTML = counter;
  document.getElementById("id02").innerHTML = tableHead + out + tableFoot;
}

// Scrape Webpage and Parse HTML Text to DOM
function scrapeHTML(html) {
  // console.log(html);
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(html,"text/html");
  jsonURL = xmlDoc.querySelector("#content > div.row > section > div > p > a").getAttribute("href");
  // console.log(jsonURL);
  loadData(jsonURL, loadJSON);
}

// Check Data.NSW json Metadata File for Latest JSON Link
// https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations
function getLatestUrlJSON(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  var covidResources = jsonObj.result.resources;
  var jsonURL;
  // console.log(covidResources);
  covidResources.forEach(element => {
    if (element.format.trim().toLowerCase() == "json") {
      // console.log(element.last_modified, element.url);
      jsonURL = element.url;
    } // END if JSON format
  }); // END FOREACH
  loadData(jsonURL, loadJSON);
}

function checkSuburb() {
  var dMonitor = jsonObject.data.monitor;
  // console.log(dMonitor[225].Suburb.trim().search(regex), typeof(burb));
  findInfo2(dMonitor);
}

// Address: "1/34-36 Ralph Street"
// Alert: "Get tested immediately and self-isolate for 14 days"
// Date: "Monday 21 June 2021"
// HealthAdviceHTML: "Anyone who attended this venue is a <a href='https://www.health.nsw.gov.au/Infectious/factsheets/Pages/advice-for-contacts.aspx'>close contact</a> and must immediately <a href='https://www.nsw.gov.au/covid-19/how-to-protect-yourself-and-others/clinics'>get tested</a> and <a href='https://www.nsw.gov.au/covid-19/what-you-can-and-cant-do-under-rules/self-isolation'>self-isolate</a> for 14 days regardless of the result, and call 1800 943 553 unless they have already been contacted by NSW Health."
// Last updated date: "Thursday 24 June 2021"
// Lat: "-33.9185194088734"
// Lon: "151.197371726959"
// Suburb: "Alexandria "
// Time: "9:20am to 9:35am"
// Venue: "Cantine Verte"
function loadJSON(jsonString) {
  jsonObject = JSON.parse(jsonString);  
  var out = "";
  var i;
  var dMonitor = jsonObject.data.monitor;  
  document.getElementById("id01").innerHTML = jsonObject.date;
  document.getElementById("id03").innerHTML = dMonitor.length;
  findInfo2(dMonitor);
}

// https://www.w3schools.com/js/js_callback.asp
// https://www.w3schools.com/XML/dom_httprequest.asp
// https://www.w3schools.com/XML/tryit.asp?filename=try_dom_loadxmltext
// Load JSON or Webpage
function loadData(varURL, cbFunction) {

  // console.log(varURL);
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // console.log("Getting URL:", varURL);
      cbFunction(this.responseText);
      responseSuccess = true;
    }
  };
  xmlhttp.open("GET", varURL, true);
  xmlhttp.send();
}

function getData() {
  // loadData(document.getElementById('location').value, scrapeHTML);
  // var urlSource = "https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9"; // Link to HTML Webpage to Scrape
  var urlSource = "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289"; // Link to Daily Metadata with Latest JSON URL
  // loadData(urlSource, scrapeHTML);
  loadData(urlSource, getLatestUrlJSON);
}

function loadSuburbButtons() {
  var suburbList = { 
                      north: [
                        "Chatswood",
                        "Eastwood",
                      ],
                      central: [
                        "Haymarket",
                        "Forest Lodge",
                        "Ultimo",
                      ],
                      south: [
                        "Alexandria",
                        "Eastgardens",
                        "Kensington",
                        "Kingsford",
                        "Moore Park",
                        "Roseberry",
                        "Waterloo",
                        "Zetland",
                      ],
                      southwest: [
                        "Bexley",
                        "Beverly Hills",
                        "Clemton Park",
                        "Hurstville",
                        "Kingsgrove",
                        "Tempe",
                      ],
                      west: [
                        "Parramatta",
                      ]
                    };
  // suburbList.forEach(element => {
  //   console.log(element);
  //   // createButton(element, true);
  // }); 
  
  for (var element in suburbList) {
    // var btnColor = ["btn-warning", "btn-danger", "btn-secondary", "btn-primary", "btn-dark" ];
    var btnColor = ["btn-warning", "btn-danger", "btn-danger", "btn-primary", "btn-primary" ];
    suburbList[element].forEach(suburbName => {
      var index = Object.keys(suburbList).indexOf(element);
      // console.log(suburbName, element, Object.keys(suburbList).indexOf(element), suburbList.valueOf(Object.keys(suburbList).indexOf(element)));
      createButton(suburbName, btnColor[index]);
    });
    document.getElementById("suburbList").appendChild(document.createElement("br"));
  }
  console.log(Object.keys(suburbList).length);
}

function createButton(suburbName, btnColor) {
  // <button type="button" class="btn btn-danger" onclick="javascript:document.getElementById('suburb').value=this.innerHTML;checkSuburb();">Chatswood</button>
  let btn = document.createElement("button");
  var btnSuburbList = document.getElementById("suburbList");
  btn.innerHTML = suburbName.trim();
  btn.setAttribute("class", "btn btn-suburb " + btnColor);
  btn.setAttribute("onclick", "javascript:document.getElementById('suburb').value=this.innerHTML;checkSuburb();");
  // btn.onclick = function () {
  //     document.getElementById("monitorViewBox").value = viewboxString;
  //     setViewBox();
  // };
  
  btnSuburbList.appendChild(btn);
  // btnSuburbList.appendChild(document.createTextNode( '\u00A0' )); // add spaces
  // document.getElementById("monitorSelectByButton").appendChild(document.createTextNode( '\u00A0\u00A0' )); // add spaces
  // if (newLine) {
  //   btnSuburbList.appendChild(document.createElement("br")); // add linebreak
  // }

}