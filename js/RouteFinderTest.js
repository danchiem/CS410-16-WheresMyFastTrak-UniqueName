function createFastestRoute() {

	var origin = document.getElementById("userInput").value;
	var destination = document.getElementById("userInput").value;

	console.log(origin);
	console.log(destination);

	//get routeId number
    var routeId = searchTripUpdateForFastestRoute(destination, origin);

	//stablish route by using the Id number, starting point and destination
	makeRoute(routeId, findNearestStop( origin ), destination);
}

function searchTripUpdateForFastestRoute(searchVal, start) {
	var routeId;
	var closestStop = findNearestStop( start );
	var stopsList;
	var arrivalTimes;

	//get trip_updates json file and search it for a starting bus stop and that it is unvisited, then checks if the destination is on the bus route after the starting point.
	$.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = $.parseJSON(JSON.stringify(data));
		for(var i = 0; i < jsonTrips.entity[i].length; i++) {
			for(var j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++) {
				if(jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id == closestStop && jsonTrips.entity[i].trip_update.stop_time_update[j].departure.time == null) {
					for(var k = j; k < jsonTrips.entity[i].trip_update.stop_time_update.length; k++) {
						if(jsonTrips.entity[i].trip_update.stop_time_update[k].stop_id == searchVal) {
							stopsList.push(jsonTrips.entity[i].id);
							arrivalTimes.push(jsonTrips.entity[i].stop_time_update[k].arrival.time);
							break;
						}
					}
				}
			}
		}
	});

	//compare bus stops to find earliest arrive time
	var comparison = arrivalTimes[0];
	for(var i = 0; i < arrivalTimes.length; i++) {
		if(comparison > arrivalTimes[i]) {
			comparison = arrivalTimes[i];
			routeId = stopsList[i];
		}
	}

	return routeId;
}

function findNearestStop(location) {
	//find the closest bus stop
	var myLatLng = locationToGeocode(location);
	var dist = null;

	for( var i = 0; i < jsonStops.entity.length; i++) {
		var comp = computeDistanceBetween(myLatLng , jsonStops.entity[i].stop_position);
		if( dist == null || dist > comp) {
			dist = comp;
			finalStop = jsonStops.entity[i].stop_id;
		}
	}

	//return closest stop
	return finalStop;
}

function makeRoute(routeId, origin, destination) {
	var waypoints;
	var waypointsCoord;

	//set marker for origin --- optional?

	//set marker for destination --- optional?

	//create array list of bus stops being traversed to reach destination
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

	//Change from stop_id to lat and long position
	var myLatLng = locationToGeocode(location);
	for(var i = 0; i < waypoints.length; i++) {
		for( var j = 0; j < busStops.length; j++) {
			if(waypoint[i] == busStops[j][1])
				myLatLng = new google.maps.LatLng( {lat : busStops[j][2], lng : busStops[j][3]});
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
        origin: originAddress,
        destination: destinationAddress,
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

function locationToGeocode(location) {
	//convert location into lat and long position
	var geocoder = new google.maps.Geocoder();
	var myLatLng;
	var finalStop;
	geocoder.geocode( { 'address': address}, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
    	var latitude = results[0].geometry.location.lat();
    	var longitude = results[0].geometry.location.lng();
    	myLatLng = new google.maps.LatLng( {lat : latitude, lng : longitude});
    	} else {
    		alert('Error :' + status);
    	}
	});

	return myLatLng;
}