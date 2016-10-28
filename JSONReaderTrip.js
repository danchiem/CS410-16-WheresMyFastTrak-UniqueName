window.onload = trip;     
var jsonObjectTrip;

function trip()
{
		jQuery.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
			jsonObjectTrip = jQuery.parseJSON(JSON.stringify(data));
			console.log(jsonObjectTrip);
		});
		setTimeout("trip()",5000);
};