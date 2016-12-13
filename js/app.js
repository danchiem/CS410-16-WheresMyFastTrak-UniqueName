var map;
var currentTripID;
var currentOrigin;
var currentDestination;
var tripStatus;
var pickupTime;
var dropoffTime;
var alertToPost;

$('#searchRoute').submit(function(e) {
	e.preventDefault();
	var origin = document.getElementById("origin").value;
	var destination = document.getElementById("destination").value;
	if(origin && destination){
		popAlert("neutral", "Searching for a route...");
		createFastestRoute(origin, destination);
	}
	return false;
});

document.getElementById("cancelButton").addEventListener("click", function(){
	if(directionDisplay != null) {
	    directionDisplay.setMap(null);
	    directionDisplay = null;
	}
	currentOrigin = null;
	currentDestination = null;
	currentTripID = null;
	pickupTime = null;
	dropoffTime = null;
	document.getElementById("infoPane").style.display = "none";
	document.getElementById("cancelButton").style.display = "none";
	popAlert("good", "Route successfully cancelled.");
});

var directionDisplay;
var latlng;

/**
 * Bus/vehicle variables
 */
var buses = new Array(1000);
var busmarkers = new Array(1000);
var busInfos = new Array(1000);

/**
 * Bus stop variables
 */
var busStops = new Array(5000);
var busStopMarkers = new Array(5000);
var busStopInfos = new Array(5000);
var tempLocalStops = new Array (10000);
var tempRealTimeStops = new Array(10000);


var vehicles;

/**
 * Method below initializes the google map module that we will be using
 */
function initMap(){
  	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 41.6907, lng: -72.7665},
	  zoom: 16,
	  mapTypeControl: false,
	  streetViewControl: false
	});
	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(41.6907, -72.7665),
		icon:  {
        url: 	"assets/img/currentPos.png",
        		scaledSize: new google.maps.Size(34, 41)
    	}
	});
	if (navigator.geolocation){
	  	navigator.geolocation.getCurrentPosition(function(position) {
		    var pos = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
		    var marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				icon:  {
		        url: 	"assets/img/currentPos.png",
		        		scaledSize: new google.maps.Size(34, 41)
		    	}
	    	});
		    map.setCenter(pos);
		});
	}
	popAlert("neutral", "Loading bus stops...");
	loadBusStops(map);
	getVehicleInfo(map);
	var alerts = alertsToDisplay();
	if(alerts != null)
		popAlert("neutral", alerts);
	setInterval(updatePositions, 30000);
}

/**
 * METHODS USED FOR BUS STOPS BELOW
 * 
 */

function nextArrivingBus(busStopID, busStopName, busStopLat, busStopLong) {
	var nextBus = new Array(2);
		$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		for (var i = 0; i < jsonTrips.entity.length; i++) {
			for (var j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++) {
				if (jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id == busStopID) {
					if (nextBus == undefined || nextBus.length == 0) {
						nextBus[0] = jsonTrips.entity[i].trip_update.vehicle.id;
						nextBus[1] = jsonTrips.entity[i].trip_update.stop_time_update[j].arrival.time;
					}
					else if (jsonTrips.entity[i].trip_update.stop_time_update[j].arrival.time < nextBus[1]) {
						nextBus[0] = jsonTrips.entity[i].trip_update.vehicle.id;
						nextBus[1] = jsonTrips.entity[i].trip_update.stop_time_update[j].arrival.time;
					}
				}
			}
		}
	});
	var bsinfo = 		'<div id="content">'+
			            '<div id="siteNotice">'+
			            '</div>'+
			            '<h1 id="firstHeading" class="firstHeading">Bus Stop ID: '+ busStopID +'</h1>'+
			            '<div id="bodyContent">' +
				            '<p>' +
					            'Bus Stop Name: ' + busStopName + '<br>' +
					            'Location (Lat / Long): ' + busStopLat + ' / ' + busStopLong + '<br>' +
				            '</p>'+
			            '</div>'+
		            '</div>';
	return bsinfo;
}

function popAlert(status, message){
	var temp = status;
	document.getElementById(temp).innerHTML = message;
	document.getElementById(temp).style.display = "block";
	setTimeout(function(){
		document.getElementById(temp).style.display = "none";
	}, 5000, temp);
}

function loadLocalBusstop(thisMap){
	$.getJSON("./assets/files/stops.json", function(data){
		localStops = jQuery.parseJSON(JSON.stringify(data));
		for(var j = 0; j < localStops.length; j++){
            tempLocalStops[j][0] = localStops[j].stop_id;
            tempLocalStops[j][1] = localStops[j].stop_name;
			tempLocalStops[j][2] = localStops[j].stop_lat;
			tempLocalStops[j][3] = localStops[j].stop_lon;
        }
        loadRealTimeBusstop(thisMap);
	});
}

function loadRealTimeBusstop(thisMap){
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		var count = 0;
		for (var l = 0; l < jsonTrips.entity.length; l++){
			for (var k = 0; k < jsonTrips.entity[l].trip_update.stop_time_update.length; k++){
				tempRealTimeStops[count] =  jsonTrips.entity[l].trip_update.stop_time_update[k].stop_id;
				count++;
			}
		}
		loadSimilarBusstops(thisMap);
	});
}

function loadSimilarBusstops(thisMap){
	var countFinal = 0;
	for(var x = 0; x < tempLocalStops.length; x++){
		if(existsInRealTimeData(tempLocalStops[x][0])){
			busStops[countFinal][0] = tempLocalStops[x][0];
			busStops[countFinal][1] = tempLocalStops[x][1];
			busStops[countFinal][2] = tempLocalStops[x][2];
			busStops[countFinal][3] = tempLocalStops[x][3];
			countFinal++;
		}
	}
	console.log(countFinal + " bus stops.");
	createBusstopMarkers(thisMap);
}

function createBusstopMarkers(thisMap){
	var count = 0;
	for(var i = 0; i < busStops.length; i++){
		if(busStops[i][0] != null){
			count++;
			busStopInfos[i] = new google.maps.InfoWindow();
			busStopMarkers[i] = new google.maps.Marker({
				map: thisMap,
				position: new google.maps.LatLng(busStops[i][2], busStops[i][3]),
				icon:  {
			        url: 	"assets/img/busstop.png",
			        		scaledSize: new google.maps.Size(15, 15)
		    	},
		    	infowindow: busStopInfos[i]
    		});
			google.maps.event.addListener(busStopMarkers[i], 'click', function(innerKey){
				return function(){
					busStopInfos[innerKey].setContent(nextArrivingBus(busStops[innerKey][0], busStops[innerKey][1], busStops[innerKey][2], busStops[innerKey][3]));
					busStopInfos[innerKey].open(thisMap, busStopMarkers[innerKey]);
				}
			}(i));
		}
	}
}

function fillBusstopsArray(thisMap){
	for(var i = 0; i < tempLocalStops.length; i++){
		tempLocalStops[i] = new Array(4);
		busStops[i] = new Array(4);
	}
	loadLocalBusstop(thisMap);
}

function existsInRealTimeData(stopID){
	for(var i = 0; i < tempRealTimeStops.length; i++){ 
		if(tempRealTimeStops[i] != null){
			if(stopID == tempRealTimeStops[i]){
				return true;
			}	
		}
	}
	return false;
}

function loadBusStops(thisMap){
	fillBusstopsArray(thisMap);
}


/**
 * METHODS USED FOR VEHICLE POSITIONING BELOW
 * 
 */

function updatePositions(){
	$.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data) {
		jsonObjectVehicle = jQuery.parseJSON(JSON.stringify(data));

		for (var i = 0; i < jsonObjectVehicle.entity.length; i++) {
			if(busmarkers[i] != null) {
				var latlng = new google.maps.LatLng(jsonObjectVehicle.entity[i].vehicle.position.latitude, jsonObjectVehicle.entity[i].vehicle.position.longitude);
				busmarkers[i].setPosition(latlng);
			}
		}
	});
}


function getVehicleInfo(thisMap){
	vehicles = new Array(1000); //enough for 1000 vehicles
	for(var k = 0; k < vehicles.length; k++){
		vehicles[k] = new Array(6);
	}
	// vehicle: id - lat - long - timestamp - routeid - tripid
	$.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data){
		jsonObjectVehicle = jQuery.parseJSON(JSON.stringify(data));
		for(var i = 0; i < jsonObjectVehicle.entity.length; i++){
			vehicles[i][0] = jsonObjectVehicle.entity[i].id;
			vehicles[i][1] = jsonObjectVehicle.entity[i].vehicle.position.latitude;
			vehicles[i][2] = jsonObjectVehicle.entity[i].vehicle.position.longitude;
			vehicles[i][3] = jsonObjectVehicle.entity[i].vehicle.timestamp;
			vehicles[i][4] = jsonObjectVehicle.entity[i].vehicle.trip.route_id;
			vehicles[i][5] = jsonObjectVehicle.entity[i].vehicle.trip.trip_id;
    		var info = 		'<div id="content">'+
				            '<div id="siteNotice">'+
				            '</div>'+
				            '<h1 id="firstHeading" class="firstHeading">Bus ID: '+ vehicles[i][0] +'</h1>'+
				            '<div id="bodyContent">'+
				            '<p>'+
				            'Vehicle Position (Lat/Long): ' + vehicles[i][1] + ' / ' + vehicles[i][1] + '<br>' +
				            'Timestamp: ' + vehicles[i][3] + '<br>' +
				            'Route ID: ' + vehicles[i][4] + '<br>' +
				            'Trip ID: ' + vehicles[i][5] + '<br>' +
				            '</p>'+
				            '</div>'+
				            '</div>';
			busInfos[i] = new google.maps.InfoWindow({
				content: info
			});
			busmarkers[i] = new google.maps.Marker({
				map: thisMap,
				position: new google.maps.LatLng(vehicles[i][1], vehicles[i][2]),
				icon:  {
			        url: 	"assets/img/busicon.png",
			        		scaledSize: new google.maps.Size(34, 41)
		    	},
		    	infowindow: busInfos[i]
    		});
    		google.maps.event.addListener(busmarkers[i], 'click', function(innerKey) {
				return function() {
					busInfos[innerKey].open(thisMap, busmarkers[innerKey]);
				}
			}(i));
			google.maps.event.addListener(busmarkers[i], 'click', function(innerKey) {
				return function() {
					showVehicleRoute(innerKey);
				}
			}(i));
		}
	});
}

function showVehicleRoute(i){
	console.log(vehicles[i][0]);
	var vehicleID = vehicles[i][0];
	var trip;
	var tripStops;
	$.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data){
		jsonObjectVehicle = jQuery.parseJSON(JSON.stringify(data));
		for(var i = 0; i < jsonObjectVehicle.entity.length; i++){
			if(jsonObjectVehicle.entity[i].id == vehicleID){
				trip = jsonObjectVehicle.entity[i].vehicle.trip.trip_id;
				break;
			}
		}
	});
	$.get("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		entities = jQuery.parseJSON(JSON.stringify(data)).entity;
		for(var j = 0; j < entities.length; j++){
			if(entities[j].id == trip){
				tripStops = entities[j].trip_update.stop_time_update;
				paintVehicleRoute(tripStops);
				break;
			}
		}
	});
}

function paintVehicleRoute(object){
	var waypoints = [];
	var temp;
	for(var i = 0; i < object.length; i++){
		temp = getStopLocation(object[i].stop_id);
		waypoints.push({
			location: new google.maps.LatLng(temp.lat, temp.lng),
			stopover: true
		});
	}
	while(waypoints.length > 23){
		waypoints.pop();
	}
	if(waypoints[0] == null || waypoints[waypoints.length - 1] == null){
		popAlert("bad", "Could not create route.");
	} else {
		paintRouteOnMap(waypoints, waypoints[0].location, waypoints[waypoints.length - 1].location);
	}
}

/**
* METHODS FOR ALERTS
*/
function alertsToDisplay()
{
	var jsonObjectAlert;
	jQuery.getJSON("http://65.213.12.244/realtimefeed/alert/alerts.json",
	 function(data){
		jsonObjectAlert = jQuery.parseJSON(JSON.stringify(data));
		console.log(jsonObjectAlert);

		var seconds = new Date().getTime() / 1000;
		if(jsonObjectAlert.entity.length != 0) {
			for(var i = 0; i , jsonObjectAlert.entity.length; i++) {
				if(seconds < jsonObjectAlert.entity.alert.active_period.end  && jsonObjectAlert.entity.alert.header_text.text !== alertToPost.entity.alert.header_text.text) {

					//for now do nothing

				} else {
					alertToPost[i] = jsonObjectAlert.entity[i];
				}
			}
		}
	});

	var alertInfo = null;
	//Form the division for display
	if(alertToPost != undefined) {
		if(alertToPost.length != 0) {
			for(var i = 0; i < alertToPost.length; i++) {
				alertInfo = 	alertToPost[i].alert.header_text.text +
								'\nDescription: ' + alertToPost[i].alert.description_text.text +
								'\nStop ID: ' + alertToPost[i].alert.informed_entity.stop_id + 
								'\nRoute ID: ' + alertToPost[i].alert.informed_entity.route_id +
								'\nStart/End Time: ' + toTimeString( alertToPost[i].alert.active_period.start ) +
							   	' / ' + toTimeString( alertToPost[i].alert.active_period.end );
			}
		}
	}

	if(alertInfo != null) {
		return alertInfo;
	}else {
		return null;
	}
}

//Function made for easy conversion of seconds to current date
function toTimeString(seconds) {
  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function checkAlertOnRoute(routeId) {
    var result = null;
    if(alertToPost != undefined) {
	    if(alertToPost.length != 0) {
	   		for(var i = 0; i < alertToPost.length; i++) {
		    	if(routeId == alertToPost.entity.alert.informed_entity.route_id) {
		    		result = 	alertToPost.entity.alert.header_text.text +
		    		'\nDescription: ' + alertToPost.entity.alert.description_text.text + 
		    		'\nEnd Time: ' + toTimeString( alertToPost.entity.alert.active_period.end );
		    	}
	    	}
	    }
	}
	return result;
}


/**
 * METHODS FOR ROUTE FINDING BELOW
 */
function isStopID(test){
	return (/^\d+$/.test(test));
}

function createFastestRoute(origin, dest) {
	console.log("createFastestRoute -> 1");
	var temp1, temp2;
	if(isStopID(origin) && isStopID(dest)){
		$.when(
			searchTripUpdateForFastestRoute(origin,  dest)
		).then(function(result){
			if(result){
				makeRoute(result, origin, dest);
			} else {
				popAlert("bad", "We could not find a route...");
			}
		});
	} else {
		$.when(
			getLatitudeLongitude(origin),
			getLatitudeLongitude(dest)
		).then(function (addressOne, addressTwo) {
			$.when(
				findNearestStop(addressOne.geometry.location),
				findNearestStop(addressTwo.geometry.location)
			).then(function(r1, r2) {
				temp1 = r1;
				temp2 = r2;
				$.when(
					searchTripUpdateForFastestRoute(temp1,  temp2)
				).then(function(result){
					if(result){
						makeRoute(result, temp1, temp2);
					} else {
						popAlert("bad", "We could not find a route...");
						currentOrigin = null;
						currentDestination = null;
						currentTripID = null;
						pickupTime = null;
						dropoffTime = null;
					}
				});
			});
		});
	}
}

function containsStops(object, start, dest){
	var startFound = false;
	var destFound = false;
	var departure;
	var arrival;
	var result;
	for(var i = 0; i < object.length; i++){
		if(object[i].stop_id == start){
			startFound = true;
			departure = object[i].departure.time;
			pickupTime = departure;
		}
		if(object[i].stop_id == dest){
			destFound = true;
			arrival = object[i].arrival.time;
			dropoffTime = arrival;
		}
	}
	if(startFound && destFound && (arrival != null)){
		console.log("Found from start -> " + start + " to -> " + dest);
		result = arrival;
	} else{
		result = 0;
	}
	return result;
}

function findFastest(promises){
	var temp;
	var final = $.Deferred();
	var comparison;
	var count = 0;

	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		$.when(promises)
	  	.then(function(results){
	  		console.log(results);
	  		results.forEach(function(result){
	  			if(result != 0 && comparison == null){
	  				comparison = result;
	  				temp = jsonTrips.entity[count].id;
	  			}
	  			else if(result != 0 && result < comparison){
					comparison = result;
					temp = jsonTrips.entity[count].id;
				}
				count++;
	  		});
			final.resolve(temp);
			currentTripID = temp;
	  	});
	  });
  	return final.promise();
}

function fillPromises(origin, dest){
	var promises = [];
	var final = $.Deferred();
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		console.log("Checking " + jsonTrips.entity.length + " entities for origin and dest...");
		for(var i = 0; i < jsonTrips.entity.length; i++) {
			promises.push(containsStops(jsonTrips.entity[i].trip_update.stop_time_update, origin, dest));
		}

		final.resolve(promises);
	});

	return final.promise();
}

function searchTripUpdateForFastestRoute(origin, dest){
	console.log("searchTripUpdate() -> 4");
	var final = $.Deferred();
	var promises = [];	
	$.when(
		fillPromises(origin, dest)
	).then(function(promises){
		$.when(
			findFastest(promises)
		).then(function(result) {
			console.log("Result from fastest -> " + result);
			final.resolve(result);
		});
	});

	return final.promise();
}

function findNearestStop(locationGeo){
	//find the closest bus stop
	console.log("findNearestStop() -> 3");

	var locationLat = locationGeo.lat();
	var locationLng = locationGeo.lng();

	console.log("Looking for stop near " + locationLat + " " + locationLng);

	var result = $.Deferred();

	var diffLat;
	var diffLng;
	var tempDiffLat;
	var tempDiffLng;
	var tempStop;

	for(var i = 0; i < busStops.length; i++){
		tempDiffLat = Math.abs(locationLat - busStops[i][2]);
		tempDiffLng = Math.abs(locationLng - busStops[i][3]);

		if((diffLat + diffLng) > (tempDiffLng + tempDiffLat) || (diffLat == null)) {
			diffLat = tempDiffLat;
			diffLng = tempDiffLng;
			tempStop = busStops[i][0];
		}
	}
	result.resolve(tempStop);

	return result.promise();
}

function getStopLocation(stopID){
	var temp = {
		lat: null,
		lng: null
	};
	for(var i = 0; i < busStops.length; i++){
		if(busStops[i][0] == stopID){
			console.log("Found location for Stop ID -> " + stopID + " at " + busStops[i][2] + " " + busStops[i][3]);
			temp.lat = busStops[i][2];
			temp.lng = busStops[i][3];
			break;
		}
	}
	return temp;
}

function findTimes(tripid, origin, destination) {
	var temp;
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		var entities = jQuery.parseJSON(JSON.stringify(data)).entity;
		for(var i = 0; i < entities.length; i++){
			if(entities[i].id == tripid){
				temp = entities[i].trip_update.stop_time_update;
			}
		}
		for(var j = 0; j < temp.length; j++){
			if(temp[j].stop_id == origin){
				pickupTime = temp[j].departure.time;
			}
			if(temp[j].stop_id == destination){
				dropoffTime = temp[j].arrival.time;
			}
		}
	});
}

function getWaypoints(routeId, origin, destination){
	console.log("TRIP ID -> " + routeId);
	console.log("ORIGIN ID -> " + origin);
	console.log("DEST ID -> " + destination);

	findTimes(routeId, origin, destination);
	currentOrigin = origin;
	currentDestination = destination;
	var waypoints = [];
	var final = $.Deferred();
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		var entities = jQuery.parseJSON(JSON.stringify(data)).entity;
		
		var entity = _.first(
			_.filter(entities, function (entity) { 
				return entity.id == routeId;
			})
		);

		var startIndex = _.findIndex(entity.trip_update.stop_time_update, function (stop) {
			return stop.stop_id == origin;
		});

		var endIndex = _.findIndex(entity.trip_update.stop_time_update, function (stop) {
			return stop.stop_id == destination;
		});

		console.log("Start index -> " + startIndex);
		console.log("End index -> " + endIndex);
		console.dir(entity);

		var temp;
		for(var i = startIndex; i <= endIndex; i++){
			temp = getStopLocation(entity.trip_update.stop_time_update[i].stop_id);
			waypoints.push({
				location: new google.maps.LatLng(temp.lat, temp.lng),
				stopover: true
			});
		}
		while(waypoints.length > 23){
			waypoints.pop();
		}
		final.resolve(waypoints);
	});

	return final.promise();
}

function paintRouteOnMap(waypoints, origin, destination){
	console.log("Attempting to map the route...");
	//run route
	var directionsService = new google.maps.DirectionsService();

	var renderOptions = { draggable: true };
	var directionsService = new google.maps.DirectionsService();
	var request;
	var polylineProps = {
		strokeColor: '#3F51B5',
		strokeOpacity: 1.0,
		strokeWeight: 10
	};
	if(directionDisplay != null) {
	    directionDisplay.setMap(null);
	    directionDisplay = null;
	}
	directionDisplay = new google.maps.DirectionsRenderer({
		draggable: false,
		map: map,
		suppressMarkers: true,
		polylineOptions: polylineProps
	});
	if(isStopID(origin) && isStopID(destination)){
	 	$.when(
			getStopLocation(origin),
			getStopLocation(destination)
		).then(function (result1, result2) {
			request = {
		        origin: result1,
		        destination: result2,
		        waypoints: waypoints, //an array
		        optimizeWaypoints: false, //false to use the order specified.
		        travelMode: google.maps.DirectionsTravelMode.DRIVING
	    	};
	    	directionsService.route(request, function(response, status) {
		    	if (status == google.maps.DirectionsStatus.OK) {
		        	directionDisplay.setDirections(response);
		        	popAlert("good", "A route has been found!");
					showTripInfo();
		    	}
		    	else {
		    		popAlert("bad", "Could not create the route.");
		    	}
			});
		});
	} else {
		request = {
	        origin: origin,
	        destination: destination,
	        waypoints: waypoints, //an array
	        optimizeWaypoints: false, //false to use the order specified.
	        travelMode: google.maps.DirectionsTravelMode.DRIVING
	    };
    	directionsService.route(request, function(response, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	        	directionDisplay.setDirections(response);
	    	}
	    	else {
	    		popAlert("bad", "Could not create the route.");
	    	}
		});
	}
}

function showTripInfo(){
	console.log(pickupTime);
	console.log(dropoffTime);
	var temp = document.getElementById("routeInfo1");
	var temp2 = document.getElementById("routeInfo2");
	var first =  "from " + currentOrigin + " to " + currentDestination + "<br>" + (new Date(pickupTime * 1000)).toLocaleString() + " pickup<br>" + (new Date(dropoffTime * 1000)).toLocaleString() + " dropoff<br>";
	var tempTime = ((dropoffTime * 1000) -(pickupTime * 1000))/1000/60 >> 0;
	var second = tempTime +  " min(s)<br>"

	temp.innerHTML = first;
	temp2.innerHTML = second;
	document.getElementById("infoPane").style.display = "block";
	document.getElementById("cancelButton").style.display = "block";
}

function makeRoute(tripid, origin, destination) {
	console.log("makeRoute() -> 5");
	$.when(
		getWaypoints(tripid, origin, destination)
	).then(function (result){
		if(result[0] != null){
			console.log("Waypoints have been collected.");
			for(var k = 0; k < result.length; k++){
				console.log(result[k].location.lat(), result[k].location.lng());
			}
			paintRouteOnMap(result, origin, destination);
		}
	});
}

function getLatitudeLongitude(address) {
	console.log("getLatLng() -> 2");
	console.log("Attempting to geocode -> " + address);
    var def = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		address: address
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			def.resolve(results[0]);
		} else {
			console.log("Geocode failed");
			popAlert("bad", "Googles geocoder failed.");
			def.reject(status);
		} 
	});

	return def.promise();
}