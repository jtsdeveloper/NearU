/* main.js */

/*---------Get Current (local) Time ----------*/

window.onload = function(){
  startTime();
}

function startTime() {                          // Load current local time
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    if (h>12){
      h = h-12;
    };
    if (h < 1){
      h = 12
    };

    document.getElementById('time').innerHTML =
    "<h3>Current Time</h3>" + "<h1>" + h + ":" + m + ":" + s + "</h1>"; // Display current local time
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
/*---------Get Current Location by HTLM5 geolocation (AND WALMART LOCATION)-------*/

var latitude, longitude;

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {

  crd = pos.coords;
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;

  /*                                                      //Test positions
  console.log('Your current position is:');
  console.log('Latitude : ' + latitude);
  console.log('Longitude: ' + longitude);
  console.log('More or less ' + crd.accuracy + ' meters.'); */

  // Insert latitude and longitude paramters into Walmart api url
  var walurl = "http://api.walmartlabs.com/v1/stores?apiKey=e42qfe3q4f7uqqbf9pgezg7g&lat=" + latitude + "&lon=" + longitude + "&format=json";

  $(function(){

    $.ajax({
      type: "GET",
      dataType: "jsonp",                                  //Retrieve JSONP
      url: walurl,
      timeout: 2000,
      success: function (data){
        $('#walmart').html(                               //Display closest Walmart
          "<h3>Closest Walmart To You</h3>" +
          "<h1>" + data[0].streetAddress + "<br>" +
          data[0].city + ", " + data[0].stateProvCode + "</h1>"
        );
      }
    })
  });
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);    //HTML5 Geolocation API


/*-------Load & Display Current City--------*/

$(function ($) {                                                     //Display current city based on IP address with GeoPlugin
  var city = geoplugin_city();
  $("#city").html("<h3>Current City</h3>" + "<h1>" + city + "</h1>" + "<p>" + "(Accuracy varies)</p>");
});

/*--------Get Current Weather for Current Location (Simple Weather jQuery Plugin)-------------*/

$(function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
  });
});

function loadWeather(location, woeid) {                       // Use simpleweather jQuery plugin
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'f',
    success: function(weather) {                             // Display current weather
      html = '<h3>Current Weather</h3>';
      html += '<h1>Current Temp: <i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h1>';
      html += '<h1>Conditions: '+ weather.currently + '</h1>';

      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}

/*-------Load Google Map & Textsearch 3 Closest Restaurants--------*/
var usermap,
    geocoder,
    currentLoc,
    service,
    placeList,
    results,
    restaurants;

function initialize() {

  currentLoc = new google.maps.LatLng(crd.latitude, crd.longitude); //store location in variable

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
      restaurants += "<h3>Closest Restaurants to You</h3>";
       for (var i = 0; i < results.length && i < 3; i++) {
        console.log(results[i].name);//Test results
        restaurants += '<h4>' + results[i].name + '</h4>'+ '<p>' + results[i].formatted_address + '<br>';        //List closest 3 restaurants
      }
      placeList = document.getElementById('restaurant');
      placeList.innerHTML = restaurants;                   //Write the restaurants to the page
    }else {
      console.log("error");
    }
  }
}                                                          //End initialize()

google.maps.event.addDomListener(window, 'load', initialize); //Load the map

google.maps.event.addDomListener(window, "resize", function() { //resize functionality
 var newcenter = usermap.getCenter();
 google.maps.event.trigger(usermap, "resize");
 usermap.setCenter(newcenter);
});
