window.onload = init;     

var jsonObjectVehicle;

function init()
{
    while(true){
        jQuery.getJSON("http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function(data){
            jsonObjectVehicle = jQuery.parseJSON(data);
            alert(JSON.stringify(data));
        });
        wait(2000);
    }
};