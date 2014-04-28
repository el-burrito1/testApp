$(document).on('ready' , function(){

	console.log($('#single').text());

	if (typeof CDV === 'undefined') {
	    alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	}
	if (typeof FB === 'undefined') {
	    alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
	}

	FB.init({
	    appId: "443530475777959",
	    nativeInterface: CDV.FB,
	    useCachedDialogs: false
	});

	// document.addEventListener('deviceready', function() {
	//     try {
	//         FB.init({
	//             appId: "443530475777959",
	//             nativeInterface: CDV.FB,
	//             useCachedDialogs: false
	//         });
	//     } catch (e) {
	//         alert(e);
	//     }
	// }, false);

	var loginButton = $('#login-with-facebook');

	$('#login-with-facebook').on('click' , function(e){
		e.preventDefault();
	})
	 
	loginButton.on('click', function(e) {
		e.preventDefault();
	 
		FB.login(function(response) {
			if (response.status === 'connected') {
				$.mobile.pageContainer.pagecontainer('change' , '#homepage');
				console.log(response);
			} else {
				alert('not logged in');
				console.log('not logged in');
			}
		},{ scope: "email" });
	 
	});

	$(document).on( "pageshow", function( event, data ){
	    var center = map.getCenter();
	    google.maps.event.trigger(map, "resize");
	    map.setCenter(center);
	});

	var map, heatmap;

	function onDeviceReady() {
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
       if (window.cordova.logger) {
           window.cordova.logger.__onDeviceReady();
       }
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
	document.addEventListener("deviceready", onDeviceReady, false);

    
})