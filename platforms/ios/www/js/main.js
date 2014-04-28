$(document).on('ready' , function(){

	var map, heatmap;

	function onDeviceReady() {

		console.log($('#single').text())
		var events

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

		FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
		    $.mobile.pageContainer.pagecontainer('change' , '#homepage');
		    FB.api('/me/events', function(response) {
		      console.log("this is the " + response);
		    });
		    var uid = response.authResponse.userID;
		    var accessToken = response.authResponse.accessToken;
		  } else if (response.status === 'not_authorized') {
		     console.log('We will deal with this later');
		     // Probably should consider adding FB.login here
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  } else {
		    // the user isn't logged in to Facebook.
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  }
		 });

		var loginButton = $('#login-with-facebook');
		 
		loginButton.on('click', function(e) {
			e.preventDefault();
		 
			FB.login(function(response) {
				if (response.status === 'connected') {
					$.mobile.pageContainer.pagecontainer('change' , '#homepage');
					console.log(response);
					FB.api('/me/events', function(response) {
					  console.log(response);
					  $.ajax({
					  	type: 'GET',
					  	url:"http://127.0.0.1:3000/events",
					  	data: {eventData: response},
					  	dataType: 'jsonp',
					  	contentType: 'application/json',
					  	crossDomain: true,
					  	success: function(data){
					  		console.log('event data successfully sent');
					  	},
					  	error: function(){
					  		console.log('there was an error');
					  	}
					  });
					});
				} else {
					$.mobile.pageContainer.pagecontainer('change' , '#login');
				}
			},{ scope: "email" }); 
		});

       navigator.geolocation.getCurrentPosition(onSuccess, onError);
	       function onSuccess(position){
	       		console.log(position);
   		    	function initialize (){
   			    	var mapOptions = {
   			    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
   			    		zoom      : 14
   			    	};
   			    	map = new google.maps.Map(document.getElementById("map-canvas"),
   			    	    mapOptions);
   				};

   		    	initialize();

   				// $(document).on( "pageshow", function( event, data ){
   				//     var center = map.getCenter();
   				//     google.maps.event.trigger(map, "resize");
   				//     map.setCenter(center);
   				// });

				$.ajax({
					type: 'GET',
					url:"http://127.0.0.1:3000/endpoint",
					data: {latitude:position.coords.latitude , longitude: position.coords.longitude},
					dataType: 'jsonp',
					contentType: 'application/json',
					crossDomain: true,
					success: function(data){
						console.log('data successfully sent');
					},
					error: function(){
						console.log('there was an error');
					}
				});

	       };
	       function onError(error){
	       		console.log(error)
	       };

       if (window.cordova.logger) {
           window.cordova.logger.__onDeviceReady();
       };
    };

    onDeviceReady();
	document.addEventListener("deviceready", onDeviceReady, false);    
})