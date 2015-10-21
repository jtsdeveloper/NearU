/* main.js */

/*---------Get Current (local) Time ----------*/

window.onload = function(){
  startTime();
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    if (h>12){
      h = h-12;
    };
    document.getElementById('time').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
/*---------Get Current Location by HTLM5 geolocation-------*/

var currentloc = document.getElementById('loc');
var msg = 'Sorry, we were unable to get your location.';

if (Modernizr.geolocation) {
  navigator.geolocation.getCurrentPosition(success, fail);
  currentloc.textContent = "Checking location...";
}else {
  currentloc.textContent = msg;
}

var latitude, longitude;
function success(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  msg = "<h3>Latitude: " + position.coords.latitude + "</h3>";
  msg += "<h3>Longitude: " + position.coords.longitude + "</h3>";

  currentloc.innerHTML = msg;
}

function fail(msg){
  currentloc.textContent = msg;
  console.log(msg.code);
}

/*-------Load & Display Current City--------*/

$(function ($) {
  var city = geoplugin_city();
  $("#city").html("<h2> City: " + city + "</h2>");
});

/*-------Load Google Map & Textsearch 3 Closest Restaurants--------*/
var usermap, geocoder, currentLoc, service, placeList, results, restaurants;
function initialize() {

  currentLoc = new google.maps.LatLng(latitude, longitude); //store location in variable

  var mapOptions = {
    center: currentLoc,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  usermap = new google.maps.Map(document.getElementById('map'), mapOptions); //create the map

  var userLoc = new google.maps.Marker({         // Create a new marker
    position: currentLoc,                        // Set its position
    map: usermap,
  });

  var request = {                               // Request location
    location: currentLoc,
    radius: '500',
    query: 'restaurants'
  };

  service = new google.maps.places.PlacesService(usermap); // Get place info
  service.textSearch(request, callback);                   //Send place info to callback function

  restaurants = "";
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < 3; i++) {
        console.log(results[i].name);//Test results
        restaurants += '<p>' + results[i].name + '<br>';        //List closest 3 restaurants
      }
      placeList = document.getElementById('restaurant');
      placeList.innerHTML = restaurants;                        //Write the restaurants to the page
    }else {
      console.log("error");
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize); //Load the map

google.maps.event.addDomListener(window, "resize", function() { //resize functionality
 var newcenter = usermap.getCenter();
 google.maps.event.trigger(usermap, "resize");
 usermap.setCenter(newcenter);
});
