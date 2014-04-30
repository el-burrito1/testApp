$(document).on('ready' , function(){

	var map, heatmap;
	var events = [];

	function onDeviceReady() {

		console.log($('#single').text())

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

		  	console.log('connected');
		  	userID = response.authResponse.userID;
		    var accessToken = response.authResponse.accessToken;
		    $.mobile.pageContainer.pagecontainer('change' , '#homepage');
			    FB.api('/me/groups', {access_token : accessToken} ,function(res) {
				      for(var i = 0 ; i < res.data.length ; i++){
				      	$('#facebookGroups').append('<input type="radio" id="' + res.data[i].name + '"/>' + '<label for="' + res.data[i].name + '">' + res.data[i].name + '</label>').trigger('create');
				      }
			    });
			    FB.api('/me', {access_token : accessToken} ,function(respuesta) {
			      gender = respuesta.gender;
			    });
		  } else if (response.status === 'not_authorized') {
		     console.log('We will deal with this later');
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  } else {
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  }
		 });

		var loginButton = $('#login-with-facebook');
		 
		loginButton.on('click', function(e) {
			e.preventDefault();
			FB.login(function(response) {
				var userID;
				var gender;
				var events = [];
				if (response.status === 'connected') {
					userID = response.authResponse.userID;
		    		var accessToken = response.authResponse.accessToken;	

					$.mobile.pageContainer.pagecontainer('change' , '#homepage');

					GetDetails();

				} else {
					$.mobile.pageContainer.pagecontainer('change' , '#login');
				}
			},{ scope: "email , user_groups , user_events" }); 
		});

		function GetDetails(){
			FB.api('/me?fields=gender,groups' , function(res){
				userID = res.id;
				gender = res.gender;
				// events = [];
				for(var i = 0 ; i < res.groups.data.length ; i++){
					events.push(res.groups.data[i].name);
				}
				initUser(userID , events , gender);
			});
		};

		function initUser(userID , events, gender){
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://127.0.0.1:3000/inituser",
    		    	data: {
    		    		userGender : gender,
    		    		_id        : userID,
    		    		userEvents : events,
    		    		latitude   : userLatitude, 
    		    		longitude  : userLongitude,
    		    	},
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

       navigator.geolocation.getCurrentPosition(onSuccess, onError);

	       function onSuccess(position){
	       		console.log(position);
	       		console.log('location event fired');
	       		userLatitude  = position.coords.latitude;
	       		userLongitude = position.coords.longitude;

	    	function initialize (){
		    	var mapOptions = {
		    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		    		zoom      : 14
		    	};
		    	map = new google.maps.Map(document.getElementById("map-canvas"),
		    	    mapOptions);
			};

	    	initialize();

			$(document).on( "pageshow", function( event, data ){
				for(var i=0 ; i<events.length ; i++){
		      		$('#facebookGroups').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
				}
			    var center = map.getCenter();
			    google.maps.event.trigger(map, "resize");
			    map.setCenter(center);
			});


			// $.ajax({
			// 	type: 'GET',
			// 	url:"http://127.0.0.1:3000/updateuser",
			// 	data: {
			// 		// userGender : gender,
			// 		_id        : userID,
			// 		userEvents : events,
			// 		latitude   : position.coords.latitude , 
			// 		longitude  : position.coords.longitude,
			// 	},
			// 	dataType: 'jsonp',
			// 	contentType: 'application/json',
			// 	crossDomain: true,
			// 	success: function(data){
			// 		console.log('data successfully sent');
			// 	},
			// 	error: function(){
			// 		console.log('there was an error');
			// 	}
			// });

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

