$(document).on('ready' , function(){

	var map, heatmap, userID, accessToken, gender, allPeople, singles, couples;
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

		  	userID = response.authResponse.userID;	
		    accessToken = response.authResponse.accessToken;

		    $.mobile.pageContainer.pagecontainer('change' , '#homepage');


       		navigator.geolocation.getCurrentPosition(onSuccess, onError);

			   
		  } else if (response.status === 'not_authorized') {
		     console.log('We will deal with this later');
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  } else {
		  	console.log('I am tripping');
		    $.mobile.pageContainer.pagecontainer('change' , '#login');
		  }
		 });


		var loginButton = $('#login-with-facebook');

		loginButton.on('click', function(e) {
			e.preventDefault();
			FB.login(function(response) {
				if (response.status === 'connected') {
					userID = response.authResponse.userID;
		    		var accessToken = response.authResponse.accessToken;	

					$.mobile.pageContainer.pagecontainer('change' , '#homepage');

					getDetails();

       				navigator.geolocation.getCurrentPosition(initSuccess, onError); 

				} else {
					$.mobile.pageContainer.pagecontainer('change' , '#login');
				}
			},{ scope: "email , user_groups , user_events" }); 
		});

		function onSuccess(position){
			updateDetails(accessToken , position);
		}



		function getDetails (accessToken){
			console.log('get details function fired');
			FB.api('/me?fields=gender,groups' , {access_token : accessToken} , function(res){
				userID = res.id;
				gender = res.gender;
				for(var i = 0 ; i < res.groups.data.length ; i++){
					events.push(res.groups.data[i].name);
				}
			});
		};

		function updateDetails (accessToken , position){
			console.log('update details function fired');
			FB.api('/me?fields=gender,groups' , {access_token : accessToken} , function(res){
				userID = res.id;
				gender = res.gender;
				for(var i = 0 ; i < res.groups.data.length ; i++){
					events.push(res.groups.data[i].name);
				}
				console.log(events);
				console.log(userID);
				console.log(position);
				updateUser(userID , events , position);
			});
		};

		function initUser(userID , events, gender){
			console.log('inituser function fired');
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
    		    		allPeople = data.all;
    		    		singles   = data.single;
    		    		couples   = data.couples;
    		    		console.log(allPeople);
    		    		console.log(singles);
    		    		console.log(couples);
    		    	},
    		    	error: function(){
    		    		console.log('there was an error');
    		    	}
    		    });
		};

		function updateUser(userID , events , position){
			console.log('update fired');
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://127.0.0.1:3000/updateuser",
    		    	data: {
    		    		_id        : userID,
    		    		userEvents : events,
    		    		latitude   : position.coords.latitude, 
    		    		longitude  : position.coords.longitude
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		console.log(data);
    		    	},
    		    	error: function(){
    		    		console.log('there was an error');
    		    	}
    		    });

	    	function initialize (){
		    	var mapOptions = {
		    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		    		zoom      : 14
		    	};
		    	map = new google.maps.Map(document.getElementById("map-canvas"),
		    	    mapOptions);
			};

	    	initialize();
	    	var center = map.getCenter();
       	    google.maps.event.trigger(map, "resize");
       	    map.setCenter(center);

       	    console.log(events);
       	    for(var i=0 ; i<events.length ; i++){
             		$('#facebookGroups').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
       		}
		};

        function initSuccess(position){
       		console.log(position);
       		console.log('location event fired');
       		userLatitude  = position.coords.latitude;
       		userLongitude = position.coords.longitude;

			initUser(userID , events , gender);

	    	function initialize (){
		    	var mapOptions = {
		    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		    		zoom      : 14
		    	};
		    	map = new google.maps.Map(document.getElementById("map-canvas"),
		    	    mapOptions);
			};

	    	initialize();
	    	var center = map.getCenter();
       	    google.maps.event.trigger(map, "resize");
       	    map.setCenter(center);

    	    console.log(events);
    	    for(var i=0 ; i<events.length ; i++){
          		$('#facebookGroups').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
    		}
        };

   //      function anotherSuccess(position){
   //     		console.log(position);
   //     		console.log('update event fired');
   //     		userLatitude  = position.coords.latitude;
   //     		userLongitude = position.coords.longitude;

			// updateDetails(accessToken);
   //     		updateUser(userID , events);

	  //   	function initialize (){
	  //   		console.log('initialize function has begun');
		 //    	var mapOptions = {
		 //    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		 //    		zoom      : 14
		 //    	};
		 //    	map = new google.maps.Map(document.getElementById("map-canvas"),
		 //    	    mapOptions);
			// };

	  //   	initialize();
	  //   	var center = map.getCenter();
   //     	    google.maps.event.trigger(map, "resize");
   //     	    map.setCenter(center);
   //      };

        function onError(error){
       		console.log(error)
        };


       if (window.cordova.logger) {
           window.cordova.logger.__onDeviceReady();
       };

       	// $(document).on( "pageshow", function( event, data ){
       	// 	console.log(events);
       	// 	for(var i=0 ; i<events.length ; i++){
        //      		$('#facebookGroups').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
       	// 	}
       	//     var center = map.getCenter();
       	//     google.maps.event.trigger(map, "resize");
       	//     map.setCenter(center);
       	// });
    };


    onDeviceReady();
	document.addEventListener("deviceready", onDeviceReady, false); 

})


