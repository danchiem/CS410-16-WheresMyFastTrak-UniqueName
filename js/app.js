var map;
var busStops = {};
var buses = {};
var route;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 41.6907, lng: -72.7665},
	  zoom: 11,
	  mapTypeControl: false,
	  streetViewControl: false
	});
	// var routeCoor = [
	// 	{lat: 41.707, lng: -72.865},
	// 	{lat: 41.507, lng: -72.665}
 //    ];
 //    var flightPath = new google.maps.Polyline({
	// 	path: routeCoor,
	// 	geodesic: true,
	// 	strokeColor: '#FF0000',
	// 	strokeOpacity: 1.0,
	// 	strokeWeight: 2
	// });
	// //busstops
	// var busStop = new google.maps.Circle({
	// 	strokeColor: '#E53935',
 //        strokeOpacity: 1,
 //        strokeWeight: 3,
	// 	fillColor: '#E53935',
	// 	fillOpacity: .5,
	// 	map: map,
	// 	center: {lat: 41.6907, lng: -72.7665},
	// 	radius: 500
 //    });
 //    var bus = new google.maps.Rectangle({
	// 	strokeColor: '#2196F3',
	// 	strokeOpacity: 1,
	// 	strokeWeight: 3,
	// 	fillColor: '#2196F3',
	// 	fillOpacity: .5,
	// 	map: map,
	// 	bounds: {
	// 		north: 41.6908,
 //            south: 41.6902,
 //            east: -72.7660,
 //            west: -72.7670
	// 	}
 //    });
	//var infoWindow = new google.maps.InfoWindow({map: map});

	// // Try HTML5 geolocation.
	// if (navigator.geolocation) {
	//   navigator.geolocation.getCurrentPosition(function(position) {
	//     var pos = {
	//       lat: position.coords.latitude,
	//       lng: position.coords.longitude
	//     };

	//     infoWindow.setPosition(pos);
	//     infoWindow.setContent('Location found.');
	//     map.setCenter(pos);
	//   }, function() {
	//     handleLocationError(true, infoWindow, map.getCenter());
	//   });
	// } else {
	//   //Browser doesn't support Geolocation
	//   handleLocationError(false, infoWindow, map.getCenter());
	// }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed. This is because local files cant track location.' :
      'Error: Your browser doesn\'t support geolocation.');
}