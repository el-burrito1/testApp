$(document).on('ready' , function(){

	$(document).on( "pageshow", function( event, data ){
	    var center = map.getCenter();
	    google.maps.event.trigger(map, "resize");
	    map.setCenter(center);
	});

	var map, heatmap;

	function onDeviceReady() {
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    function onSuccess(position){

    	function initialize (){
	    	var mapOptions = {
	    		center    : new google.maps.LatLng(34.0194543, -118.4911912),
	    		zoom      : 14
	    	};
	    	map = new google.maps.Map(document.getElementById("map-canvas"),
	    	    mapOptions);
		};

    	google.maps.event.addDomListener(window, 'load', initialize);

    };

    function onError(error){
    	console.log(error)
    };

    onDeviceReady()
    
})