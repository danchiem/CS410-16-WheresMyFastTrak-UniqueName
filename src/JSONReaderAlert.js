window.onload = init;     

var jsonObjectAlert;

function init()
{
	while(true) {
    	jQuery.getJSON("http://65.213.12.244/realtimefeed/alert/alerts.json", function(data){
        	jsonObjectAlert = jQuery.parseJSON(data);
        	alert(JSON.stringify(data));  	
    	});
    	wait(2000);
    }
};