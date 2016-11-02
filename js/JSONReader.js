window.onload = init; 
    
var jsonObjectVehicle;
var jsonObjectTrip;
var jsonObjectAlert;

function init()
{
		JSONRead("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", jsonObjectVehicle);
		
		//The following lines of code are for the other JSON Files. They are not needed for this sprint.
		//JSONRead("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", jsonObjectTrip);
		//JSONRead("http://65.213.12.244/realtimefeed/alert/alerts.json", jsonObjectAlert);
		setTimeout("init()",1000);
};

function JSONRead( url, object ) {
	jQuery.getJSON(url, function(data){
			object = jQuery.parseJSON(JSON.stringify(data));
			//prints to console to see updating of object array. !TESTING PURPOSE!
			//console.log(object); 

			console.log("JSONObject has been updated");
		});
}