window.onclick = function createFastestRoute() {

	//get routeId number
    var routeId = searchTripUpdateForFastestRoute(destination, origin);
	//var origin = document.getElementById("userInput").value;
	//var destination = document.getElementById("userInput").value;
	
	var origin = '142 Jerome Ave. Burlington, CT 06013';
	var destination = '1615 Stanley Street, New Britain, CT 06053';
	
	console.log(origin);
	console.log(destination);


	//stablish route by using the Id number, starting point and destination
	makeRoute(routeId, findNearestStop( origin ), destination);
}

function searchTripUpdateForFastestRoute(searchVal, start) {
	var routeId;
	var closestStop = findNearestStop( start );
	var stopList = new Array();
	var arrivalTimes = new Array();

	//get trip_updates json file and search it for a starting bus stop and that it is unvisited, then checks if the destination is on the bus route after the starting point.
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = $.parseJSON(JSON.stringify(data));
		for(var i = 0; i < jsonTrips.entity[i].length; i++) {
			for(var j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++) {
				if(jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id == closestStop && jsonTrips.entity[i].trip_update.stop_time_update[j].departure.time == null) {
					for(var k = j; k < jsonTrips.entity[i].trip_update.stop_time_update.length; k++) {
						if(jsonTrips.entity[i].trip_update.stop_time_update[k].stop_id == searchVal) {
							stopList[i] = jsonTrips.entity[i].id;
							arrivalTimes[i] = jsonTrips.entity[i].stop_time_update[k].arrival.time;
							break;
						}
					}
				}
			}
		}
	});

	//compare bus stops to find earliest arrive time
	var comparison = 99999999999999;
	for(var i = 0; i < arrivalTimes.length; i++) {
		if(comparison > arrivalTimes[i]) {
			comparison = arrivalTimes[i];
			routeId = stopList[i];
		}
	}

	return routeId;
}

function findNearestStop(location) {
	//find the closest bus stop
	var myLatLng = locationToGeocode(location);
	var distLat = null;
	var disLng = null;
	var finalStop;

	for( var i = 0; i < busStops.length; i++) {
		var compLatLng = new google.maps.LatLng( parseFloat(busStops[i][2]), parseFloat(busStops[i][3]) );
		
		if( distLat == null || distLng == null ) {
			distLat = compLatLng.lat();
			distLng = compLatLng.lng();
		}
			
		if( distLat > compLatLng.lat() || distLng > compLatLng.lng() ) {
			distLat = compLatLng.lat();
			distLng = compLatLng.lng();
			finalStop = busStops[i][1];
		}
	}

	//return closest stop
	return finalStop;
}

function makeRoute(routeId, origin, destination) {
	var waypoints = new Array();
	var waypointsCoord = new Array();

	//set marker for origin --- optional?

	//set marker for destination --- optional?

	//create array list of bus stops being traversed to reach destination
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = $.parseJSON(JSON.stringify(data));
		for(var i = 0; i < jsonTrips.entity[i].length; i++) {
			for(var j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++) {
				if(jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id == origin && jsonTrips.entity[i].trip_update.stop_time_update[j].departure.time == null) {
					for(var k = j; k < jsonTrips.entity[i].trip_update.stop_time_update.length; k++) {
						if(jsonTrips.entity[i].trip_update.stop_time_update[k].stop_id != destination) {
							waypoints.push( {location : jsonTrips.entity[i].trip_update.stop_time_update[k].stop_id });
						} else {
							waypoints.push( {location : jsonTrips.entity[i].trip_update.stop_time_update[k].stop_id });
							break;
						}
					}
				}
			}
		}
	});

	//Change from stop_id to lat and long position
	var myLatLng = locationToGeocode(location);
	for(var i = 0; i < waypoints.length; i++) {
		for( var j = 0; j < busStops.length; j++) {
			if(waypoint[i] == busStops[j][1])
				myLatLng = new google.maps.LatLng( parseFloat(busStops[i][2]), parseFloat(busStops[i][3]) );
				waypointsCoord.push(myLatLng);
		}
	}

	//run route
	var directionsService = new google.maps.DirectionsService();

	var renderOptions = { draggable: true };
	var directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

	//set the directions display service to the map
	directionDisplay.setMap(map);
	//build directions request
	var request = {
        origin: origin,
        destination: destination,
        waypoints: waypointsCoord, //an array
        optimizeWaypoints: false, //false to use the order specified.
        travelMode: google.maps.DirectionsTravelMode.TRANSIT
    };

	//get the route from the directions service
	directionsService.route(request, function (response, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
        	directionDisplay.setDirections(response);
    	}
    	else {
        	//handle error
        	alert('Could not make directions: ' + status);
    	}
	});

}

function locationToGeocode(place) {
	//convert location into lat and long position
	var geocoder = new google.maps.Geocoder();
	var myLatLng;
	var finalStop;
	geocoder.geocode( { 'address': place}, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
    	var latitude = results[0].geometry.location.lat();
    	var longitude = results[0].geometry.location.lng();
    	myLatLng = new google.maps.LatLng( parseFloat(latitude), parseFloat(longitude) );
    	} else {
    		alert('Error :' + status);
    	}
	});

	return myLatLng;
}