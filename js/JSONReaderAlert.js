window.onload = alerts;     
var jsonObjectAlert;

function alerts()
{
		jQuery.getJSON("http://65.213.12.244/realtimefeed/alert/alerts.json", function(data){
			jsonObjectAlert = jQuery.parseJSON(JSON.stringify(data));
			console.log(jsonObjectAlert);
		});
		setTimeout("alerts()",5000);
};