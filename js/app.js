var map;

$('#searchRoute').submit(function(e) {
	e.preventDefault();
	createFastestRoute();
	return false;
});

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


/**
 * Method below initializes the google map module that we will be using
 */
function initMap(){
  	var map = new google.maps.Map(document.getElementById('map'), {
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
	loadBusStops(map);
	getVehicleInfo(map);
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
					            'Next bus / time: ' + nextBus[0] + ' / ' + nextBus[1] + '<br>' +
				            '</p>'+
			            '</div>'+
		            '</div>';
	return bsinfo;
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
			        url: 	"assets/img/busstopicon.png",
			        		scaledSize: new google.maps.Size(34, 41)
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
	for(var i = 0; i < busmarkers.length; i++){
		if(busmarkers[i] != null){
			getNewPosition(i);
		}
	}
}

function getNewPosition(i){
	var latlng;
	$.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data){
		jsonObjectVehicle = jQuery.parseJSON(JSON.stringify(data));
		latlng = new google.maps.LatLng(jsonObjectVehicle.entity[i].vehicle.position.latitude, jsonObjectVehicle.entity[i].vehicle.position.longitude);
		busmarkers[i].setPosition(latlng);
	});
}

function getVehicleInfo(thisMap){
	var vehicles = new Array(1000); //enough for 1000 vehicles
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
		}
	});
}

/**
 * METHODS FOR ROUTE FINDING BELOW
 */
function createFastestRoute() {
	//var origin = document.getElementById("userInput").value;
	//var destination = document.getElementById("userInput").value;
	//var originLatLng = getLatitudeLongitude('142 Jerome Ave. Burlington, CT 06013');
	
	var results = { };

	$.when(
		getLatitudeLongitude('1500 New Britain Ave, West Hartford, CT 06110'),
		getLatitudeLongitude('1615 Stanley Street, New Britain, CT 06053')
	).then(function (addressOne, addressTwo) {
		searchTripUpdateForFastestRoute(addressOne.geometry.location, addressTwo.geometry.location);
		console.log("Drew route between");
	});
}

function containsStops(object, start, dest){
	var startFound = false;
	var destFound = false;
	start = 8320;
	dest = 12665;
	var arrival = 0;
	for(var i = 0; i < object.length; i++){
		if(object[i].stop_id == start){
			startFound = true;
		}
		if(object[i].stop_id == dest){
			destFound = true;
			arrival = object[i].arrival.time;
		}
	}
	if(startFound && destFound && arrival != null){
		return arrival;
	}
	return 0;
}

function searchTripUpdateForFastestRoute(searchVal, start){
	var routeId = $.Deferred();
	var closestStartStop = findNearestStop(start);
	var closestDestStop = findNearestStop(searchVal);
	var comparison = 99999999999999999999;
	var temp;
	//get trip_updates json file and search it for a starting bus stop and that it is unvisited, then checks if the destination is on the bus route after the starting point.
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		var temp2;
		for(var i = 0; i < jsonTrips.entity.length; i++) {
			temp = containsStops(jsonTrips.entity[i].trip_update.stop_time_update, closestStartStop, closestDestStop);
			if(temp != 0){
				if(temp < comparison){
					comparison = temp;
					temp2 = jsonTrips.entity[i].trip_update.trip.route_id; 
				}
			}
		}
		routeId.resolve(temp2);
	});

	$.when(routeId).then(function(result){
		makeRoute(result, closestStartStop, closestDestStop);
	});
}

function findNearestStop(locationGeo){
	//find the closest bus stop
	var locationLat = locationGeo.lat();
	var locationLng = locationGeo.lng();
	var finalStop;

	var diffLat = 99999999;
	var diffLng = 99999999;

	var tempDiffLat = 0;
	var tempDiffLng = 0;

	for(var i = 0; i < busStops.length; i++){
		tempDiffLat = Math.abs(locationLat - busStops[i][2]);
		tempDiffLng = Math.abs(locationLng - busStops[i][3]);

		if((diffLat + diffLng) > (tempDiffLng + tempDiffLat)) {
			diffLat = tempDiffLat;
			diffLng = tempDiffLng;
			finalStop = busStops[i][0];
		}
	}
	return finalStop;
}

function getStopLocation(stopID){
	for(var i = 0; i < busStops.length; i++){
		if(busStops[i][0] == stopID){
			return new google.maps.LatLng(busStops[i][2], busStops[i][3]);
		}
	}
	return null;
}

function makeRoute(routeId, origin, destination) {
	var waypoints = new Array();
	console.log("Make route: " + routeId);
	//set marker for origin --- optional?
	//set marker for destination --- optional?
	//create array list of bus stops being traversed to reach destination

	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data) {
		var entities = jQuery.parseJSON(JSON.stringify(data)).entity;
		console.log("ORIGIN: " + origin);

		
		var entity = _.first(
			_.filter(entities, function (entity) { 
				return entity.trip_update.trip.route_id == routeId
			})
		)

		var startIndex = _.findIndex(entity.trip_update.stop_time_update, function (busStop) {
			return busStop.stop_id == origin;
		})

		var endIndex = _.findIndex(entity.trip_update.stop_time_update, function (busStop) {
			return busStop.stop_id == destination;
		})

		var busStops = _.range(startIndex, endIndex);
		
		console.log(busStops);

	});

	console.log(waypoints.length);
	for(var e = 0; e < waypoints.length; e++){
		console.log(waypoints[e].lat(), waypoints[e].lng());
	}
	//run route
	var directionsService = new google.maps.DirectionsService();

	var renderOptions = { draggable: true };
	var directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

	//set the directions display service to the map
	directionDisplay.setMap(map);
	//build directions request
	var request = {
        origin: getStopLocation(origin),
        destination: getStopLocation(destination),
        waypoints: waypoints, //an array
        optimizeWaypoints: false, //false to use the order specified.
        travelMode: google.maps.DirectionsTravelMode.TRANSIT
    };

	//get the route from the directions service
	directionsService.route(request, function(response, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
        	directionDisplay.setDirections(response);
    	}
    	else {
        	//handle error
        	alert('Could not make directions: ' + status);
    	}
	});
}

function getLatitudeLongitude(address) {
    var def = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		address: address
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			def.resolve(results[0]);
			return;
		} 

		def.reject(status);
	});

	return def.promise();
}