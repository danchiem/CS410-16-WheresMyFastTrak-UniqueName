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

	var alertInfo = null;
	//Form the division for display
	if(alertToPost.entity != null) {
		alertInfo = 	alertToPost.entity.alert.header_text.text +
						 	'\nDescription: ' + alertToPost.entity.alert.description_text.text +
						   	'\nStop ID: ' + alertToPost.entity.alert.informed_entity.stop_id + 
						   	'\nRoute ID: ' + alertToPost.entity.alert.informed_entity.route_id +
						   	'\nStart/End Time: ' + toTimeString( alertToPost.entity.alert.active_period.start ) +
					   		' / ' + toTimeString( alertToPost.entity.alert.active_period.end );
	}

	if(alertInfo != null) {
		return alertInfo;
	}else {
		return null;
	}
}

//Function made for easy conversion of seconds to current date
function toTimeString(seconds) {
  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}


//
function checkAlertOnRoute(routeId) {
    var result;

   if(alertToPost.entity != null) {
    	if(routeId == alertToPost.entity.alert.informed_entity.route_id) {
    		result = 	alertToPost.entity.alert.header_text.text +
    		'\nDescription: ' + alertToPost.entity.alert.description_text.text + 
    		'\nEnd Time: ' + toTimeString( alertToPost.entity.alert.active_period.end );
    	}
    }
	return result;
}