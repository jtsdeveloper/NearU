/* main.js */

/*---------Get Current Location-------*/

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

/*-------Load Google Map --------*/

function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(latitude, longitude),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions)
}
google.maps.event.addDomListener(window, 'load', initialize);
