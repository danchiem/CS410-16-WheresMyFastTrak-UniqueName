window.onload = init;     

var jsonObjectTrip;

function init()
{
	while(true) {
    	jQuery.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
        	jsonObjectTrip = jQuery.parseJSON(data);
        	alert(JSON.stringify(data));  	
    	});
    	wait(2000);
    }
};