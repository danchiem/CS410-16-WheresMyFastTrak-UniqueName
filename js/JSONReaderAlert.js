window.onload = alerts;     

var alertToPost;
function alerts()
{
	var jsonObjectAlert;
	jQuery.getJSON("http://65.213.12.244/realtimefeed/alert/alerts.json",
	 function(data){
		jsonObjectAlert = jQuery.parseJSON(JSON.stringify(data));
		console.log(jsonObjectAlert);

		var seconds = new Date().getTime() / 1000;

		if(seconds < jsonObjectAlert.entity.alert.active_period.end  && jsonObjectAlert.entity.alert.header_text.text !== alertToPost.entity.alert.header_text.text) {

			//for now do nothing

		} else {
			alertToPost = jsonObjectAlert;
		}

	});

	//Form the division for display
	var alertInfo = 	'<div id="content">'+
			            '<div id="siteNotice">'+
			           	'</div>'+
			          	'<h1 id="firstHeading" class="firstHeading">'+ alertToPost.entity.alert.header_text.text +'</h1>'+
			           	'<div id="bodyContent">' +
				            '<p>' +
					    	   	'Description: ' + alertToPost.entity.alert.description_text.text + '<br>' +
					       	   	'Stop ID: ' + alertToPost.entity.alert.informed_entity.stop_id + '<br>' +
					      	   	'Route ID: ' + alertToPost.entity.alert.informed_entity.route_id + '<br>' +
					      	   	'Start/End Time: ' + toTimeString( alertToPost.entity.alert.active_period.start ) + ' / ' + toTimeString( alertToPost.entity.alert.active_period.end ) +'<br>' 
				            '</p>'+
			            '</div>'+
		            	'</div>';
	return alertInfo;

	setTimeout("alerts()",30000);
};

//Function made for easy conversion of seconds to current date
function toTimeString(seconds) {
  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}


//
function checkAlertOnRoute(routeId) {
    var result;

    //Make it so that it only does this if alert is not empty
    if(routeId == alertToPost.entity.alert.informed_entity.route_id) {
    	result = 	'<div is ="content">'+
    				'<div id="siteNotice">'+
			           	'</div>'+
			          	'<h1 id="firstHeading" class="firstHeading">'+ alertToPost.entity.alert.header_text.text +'</h1>'+
			           	'<div id="bodyContent">' +
				            '<p>' +
					    	   	'Description: ' + alertToPost.entity.alert.description_text.text + '<br>' +
					      	   	'End Time: ' + toTimeString( alertToPost.entity.alert.active_period.end ) +'<br>' 
				            '</p>'+
			            '</div>'+
		            	'</div>';
    }
	return result;
}