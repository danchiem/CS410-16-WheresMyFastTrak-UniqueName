function getBusStopList(){
    
    var i = 0;
    var j = 0;
    var index = 0;
        
        // uses tempBusStops to hold stop_id
    for( i = 0; i < tempBusStops.length; i++){
		tempBusStops[i] = new Array(4); //stop_id, name, lat, long
	}
    
     for( i = 0; i < tempBusStops.length; i++){  // will hold the list for LoadBusStop()
		arrBusStopsID[i] = new Array(4); //stop_id, name, lat, long
	}
    
	$.getJSON("./assets/files/stops.json", function(data){
		tempJsonStops = jQuery.parseJSON(JSON.stringify(data));
        for( i = 0; i < tempJsonStops.length; i++){
            tempBusStops[i][0] = tempJsonStops[i].stop_id;
            tempBusStops[i][1] = jsonStops[i].stop_name;
			tempBusStops[i][2] = jsonStops[i].stop_lat;
			tempBusStops[i][3] = jsonStops[i].stop_lon;
        }
        
    }
    // uses jsonStopID to hold stop_id
    $.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		for( i = 0; i < jsonTrips.entity.length; i++){
			for( j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++){
                jsonStopID[index] = jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id;
                index++;
            }
        }
    }
    
   // compiling into one list
   for (  i = 0; i < jsonStopID.length; i++){
        for(  j = 0; j < tempBusStops.length; j++){
            if( jsonStopID[i] == tempBusStops[j][0]){
                arrBusStopID[index][0] = tempBusStops[j][0];
                arrBusStopID[index][1] = tempBusStops[j][1];
                arrBusStopID[index][2] = tempBusStops[j][2];
                arrBusStopID[index][3] = tempBusStops[j][3]; 
                 index++;
            }            
        }
    }
}