window.onload = init; 
    
var jsonObjectVehicle;
var jsonObjectTrip;
var jsonObjectAlert;

function init()
{
		jQuery.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data){
			jsonObjectVehicle = jQuery.parseJSON(JSON.stringify(data));
			console.log(jsonObjectVehicle);
		});
		jQuery.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
			jsonObjectTrip = jQuery.parseJSON(JSON.stringify(data));
			console.log(jsonObjectTrip);
		});
		jQuery.getJSON("http://65.213.12.244/realtimefeed/alert/alerts.json", function(data){
			jsonObjectAlert = jQuery.parseJSON(JSON.stringify(data));
			console.log(jsonObjectAlert);
		});
		setTimeout("init()",5000);
};