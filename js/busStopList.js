function getBusStopList(){
    
    var i = 0;
    var j = 0;
    var index = 0;
    
    // uses tempBusStops to hold stop_id
    for( i = 0; i < tempBusStops.length; i++){
		tempBusStops[i] = new Array(4); //stop_id, name, lat, long
	}
    
     for( i = 0; i < busStops.length; i++){
		busStops[i] = new Array(4); //stop_id, name, lat, long
	}
    
    //temp storing all bus stop info
	$.getJSON("./assets/files/stops.json", function(data){ 
		tempJsonStops = jQuery.parseJSON(JSON.stringify(data));
        for( i = 0; i < tempJsonStops.length; i++){
            tempBusStops[i][0] = tempJsonStops[i].stop_id;
            tempBusStops[i][1] = tempJsonStops[i].stop_name;
			tempBusStops[i][2] = tempJsonStops[i].stop_lat;
			tempBusStops[i][3] = tempJsonStops[i].stop_lon;
        }      

        $.getJSON("http://65.213.12.244/realtimefeed/tripupdate/tripupdates.json", function(data){ // inner json call
		jsonTrips = jQuery.parseJSON(JSON.stringify(data));
		index = 0;
        for( i = 0; i < jsonTrips.entity.length; i++){
			for( j = 0; j < jsonTrips.entity[i].trip_update.stop_time_update.length; j++){
                tempJsonStopID[index] = jsonTrips.entity[i].trip_update.stop_time_update[j].stop_id;
                index++;
                
                
            }
        }
    
    for(var i=0;i<tempJsonStopID.length;i++) // removes duplicates
        {
        var str=tempJsonStopID[i];
        if(jsonStopID.indexOf(str)==-1)
            {
            jsonStopID.push(str);
            }
        }
           for( i = 0; i < jsonStopID.length; i++){
            if( jsonStopID[i] == tempBusStops[i][0]){
            busStops[i][0] = tempBusStops[i].stop_id;
            busStops[i][1] = tempBusStops[i].stop_name;
			busStops[i][2] = tempBusStops[i].stop_lat;
			busStops[i][3] = tempBusStops[i].stop_lon;          
            }
        }
        console.log(tempBusStops);
    
       
    });
 
        
    });

}