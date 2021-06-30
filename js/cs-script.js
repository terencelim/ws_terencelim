var jsonURL;
var arr;
var responseSuccess = false;

// https://www.w3schools.com/js/js_callback.asp
// https://www.w3schools.com/XML/dom_httprequest.asp
// https://www.w3schools.com/XML/tryit.asp?filename=try_dom_loadxmltext
function loadData(varURL, cbFunction) {

  // console.log(varURL);
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {    
    if (this.readyState == 4 && this.status == 200) {
      cbFunction(this.responseText);
      responseSuccess = true;
    }
  };
  xmlhttp.open("GET", varURL, true);
  xmlhttp.send();
}

function test() {
  loadData(document.getElementById('location').value, scrapeHTML);
}

function scrapeHTML(html) {
  // console.log(html);
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(html,"text/html");
  jsonURL = xmlDoc.querySelector("#content > div.row > section > div > p > a").getAttribute("href");
  console.log(jsonURL);
  loadData(jsonURL, loadJSON);  
}

var tableHead = "<table class='table table-sm table-striped fixed_header'><thead class='thead-dark'><tr><th scope='col' class='thSuburb'>Suburb</th><th scope='col' class='thVenue'>Venue</th><th scope='col' class='thAddress'>Address</th><th scope='col' class='thDate'>Date</th><th scope='col' class='thTime'>Time</th><th scope='col' class='thUpdate'>Last Updated</th><th scope='col' class='thAlert'>Alert</th><th scope='col' class='thAdvice'>Health Advice</th></tr></thead><tbody>";
var tableBody = "<tr><td class='tdSuburb' title='Suburb'>{{suburb}}</td><td class='tdVenue' title='Venue'>{{venue}}</td><td class='tdAddress' title='Address'>{{address}}</td><td class='tdDate' title='Date'>{{date}}</td><td class='tdTime' title='Time'>{{time}}</td><td class='tdUpdate' title='Last Update'>{{lastupdate}}</td><td class='tdAlert' title='Alert'>{{alert}}</td><td class='tdAdvice' title='Health Advice'>{{advice}}</td></tr>";
var tableFoot = "</tbody></table>";

function findInfo(dMonitor) {
  var out = "";
  var i;
  var SearchSuburb = document.getElementById('suburb').value;
  var regex = new RegExp(SearchSuburb.trim(), "i");
  for(i = 0; i < dMonitor.length; i++) {
    if (dMonitor[i].Suburb.trim().search(regex) >= 0)
    {
      out +='<span class="labels suburb">' + dMonitor[i].Suburb + '</span> | ' +  
            '<span class="labels venue">' + dMonitor[i].Venue + '</span><br>' + 
            '<span class="labels">Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> ' + dMonitor[i].Address + '<br>' + 
            '<span class="labels">Date & Time:</span> ' + dMonitor[i]['Last updated date'] + ' | ' + 
            dMonitor[i].Time + '<br>' + 
            '<span class="labels calert">Alert&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> ' + dMonitor[i].Alert + '<br>' + 
            '<span class="labels cadvice">Health Advice:</span> ' + dMonitor[i].HealthAdviceHTML + 
            '<br><br>';
    }
  }
  document.getElementById("id02").innerHTML = out;
}

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
    }
    
  }
  document.getElementById("id02").innerHTML = tableHead + out + tableFoot;
}

function checkSuburb() {
  var dMonitor = arr.data.monitor;
  // console.log(dMonitor[225].Suburb.trim().search(regex), typeof(burb));
  findInfo2(dMonitor);
}

function loadJSON(jsonString) {
  arr = JSON.parse(jsonString);  
  var out = "";
  var i;
  var dMonitor = arr.data.monitor;  
  document.getElementById("id01").innerHTML = arr.date;
  document.getElementById("id03").innerHTML = dMonitor.length;
  findInfo2(dMonitor);
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
}

