$(document).on('ready' , function(){

	///////GLOBAL VARIABLES/////////////

	var map, heatmap, userID, accessToken, gender, allPeople, singles, couples, relationshipStatus, oppositeGenderPref;
	var groups       = [];
	var events       = [];

	var allArray     = [];
	var singleArray  = [];
	var coupleArray  = [];

	var uniqueArray  = [];

	/////////GLOBAL VARIABLES////////////

	function onDeviceReady() {

		console.log($('#single').text())

	/////////////////////////////////////ENTERING FACEBOOK AUTH TERRITORY/////////GOOD LUCK!!!!!!!!!!/////////////////////////////////////////////////////////

		//////FB INIT////////

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

		/////FB INIT/////////

		/////CHECK IF USER HAS ALREADY AUTHORIZED APP AND FIRE GEOLOCATION/////

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

		function onSuccess(position){
			updateDetails(accessToken , position);
		};

		function updateDetails (accessToken , position){
			console.log('update details function fired');
			FB.api('/me?fields=gender,groups,events' , {access_token : accessToken} , function(res){
				userID = res.id;
				gender = res.gender;
				console.log(res.events);
				for(var i = 0 ; i < res.events.data.length ; i++){
					events.push(res.events.data[i].name);
				}

				for(var i = 0 ; i < res.groups.data.length ; i++){
					groups.push(res.groups.data[i].name);
				}
				console.log(events);
				console.log(groups);
				console.log(userID);
				console.log(position);
				updateUser(userID , events , position);
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
    		    		console.log(data.people.all);

    		    		allArray      = data.people.all;
    		    		singleArray   = data.people.single;
    		    		coupleArray   = data.people.couples;

    		    		relationshipStatus = data.currentUser[0].single;

    		    		if(relationshipStatus === true){
    		    			$('#single').attr('checked' , true).checkboxradio('refresh');
    		    		} else {
    		    			$('#couple').attr('checked' , true).checkboxradio('refresh');
    		    		};


    		    		if(data.currentUser[0].gender === 'male' || data.currentUser[0].genderPrefOpposite === true){
							$('#female').attr('checked' , true).checkboxradio('refresh');
    		    		} else {
							$('#male').attr('checked' , true).checkboxradio('refresh');
    		    		};
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
             		$('#facebookEvents').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
       		};

       		for(var i=0 ; i<groups.length ; i++){
             		$('#facebookGroups').append('<input type="radio" id="' + groups[i] + '"/>' + '<label for="' + groups[i] + '">' + groups[i] + '</label>').trigger('create');
       		};
		};



		/////END CHECK IF USER HAS ALREADY AUTHORIZED APP AND FIRE GEOLOCATION/////

		///******WOO WOO WOO**********/////

		////LOGIN ACTION AND GEOLOCATE FOR INITIAL USER///////


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

		function getDetails (accessToken){
			console.log('get details function fired');
			FB.api('/me?fields=gender,groups,events' , {access_token : accessToken} , function(res){
				userID = res.id;
				gender = res.gender;

				for(var i = 0 ; i < res.events.data.length ; i++){
					events.push(res.events.data[i].name);
				}

				for(var i = 0 ; i < res.groups.data.length ; i++){
					groups.push(res.groups.data[i].name);
				}
				if(gender === 'male'){
					$('#female').attr('checked' , true).checkboxradio('refresh');
				} else {
					$('#male').attr('checked' , true).checkboxradio('refresh');
				}
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
    		    		allArray      = data.all;
    		    		singleArray   = data.single;
    		    		coupleArray   = data.couples;
    		    	},
    		    	error: function(){
    		    		console.log('there was an error');
    		    	}
    		    });
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
          		$('#facebookEvents').append('<input type="radio" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>').trigger('create');
    		};

    		for(var i=0 ; i<groups.length ; i++){
             	$('#facebookGroups').append('<input type="radio" id="' + groups[i] + '"/>' + '<label for="' + groups[i] + '">' + groups[i] + '</label>').trigger('create');
       		};
        };

        function onError(error){
       		console.log(error)
        };

        /////END LOGIN ACTION AND GEOLOCATE FOR INITAL USER//////

////////////////////////////////FACEBOOK AUTH COMPLETE//////ENTERING PAGE EVENT TERRITORY!!!!!!/////////////////////////////////////////////////////////////////////////////////////



////////******************************////////////////////////////



///////////////USER GENDER PREFERENCE SECTION/////////////////////////

	   $('#male').bind('change' , function(){
	   		if(gender === 'male'){
	   			updatePreferenceSame();
	   			oppositeGenderPref === false;
	   		} else if (gender === 'female'){
	   			updatePreferenceOpposite();
	   			oppositeGenderPref === true;
	   		};
	   });

	   $('#female').bind('change' , function(){
	   		if(gender === 'male'){
	   			updatePreferenceOpposite();
	   			oppositeGenderPref === true;
	   		} else if (gender === 'female'){
	   			updatePreferenceSame();
	   			oppositeGenderPref === false;
	   		}
	   });

	
       function updatePreferenceSame(){
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://127.0.0.1:3000/updateprefsame",
    		    	data: {
    		    		userGender : gender,
    		    		_id        : userID,
    		    		test       :'hello'
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		allArray      = data.all;
    		    		singleArray   = data.single;
    		    		coupleArray   = data.couples;
    		    	},
    		    	error: function(){
    		    		console.log('there was an error');
    		    	}
    		    });
       };

      function updatePreferenceOpposite(){
			$.ajax({
   		    	type: 'GET',
   		    	url:"http://127.0.0.1:3000/updateprefopposite",
   		    	data: {
   		    		_id: userID,
   		    		test: 'hello'
   		    	},
   		    	dataType: 'jsonp',
   		    	contentType: 'application/json',
   		    	crossDomain: true,
   		    	success: function(data){
   		    		allArray      = data.all;
    		    	singleArray   = data.single;
    		    	coupleArray   = data.couples;
   		    	},
   		    	error: function(){
   		    		console.log('there was an error');
   		    	}
   		    });
      };



///////////////END USER GENDER PREFERENCE SECTION/////////////////////////

///////////////UPDATE RELATIONSHIP STATUS SECTION///////////////////////////

		$('#single').bind('change' , function(){
			updateRelationshipSingle();
		});

		$('#couple').bind('change' , function(){
			updateRelationshipCouple();
		})
		
		function updateRelationshipSingle(){
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://127.0.0.1:3000/updaterelationshipsingle",
    		    	data: {
    		    		_id: userID,
    		    		test: 'single'
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
		};

		function updateRelationshipCouple(){
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://127.0.0.1:3000/updaterelationshipcouple",
    		    	data: {
    		    		_id: userID,
    		    		test: 'couple'
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
		};

///////////////END UPDATE RELATIONSHIP STATUS SECTION///////////////////////////

///////BEGIN HEATMAP EFFECT BY CREATING SINGLE/COUPLE/ALL LATITUDE AND LONGITUDE ARRAY OUT OF INITIAL ARRAY///////////

	var singleLat  = [];
	var singleLong = [];
	var coupleLat  = [];
	var coupleLong = [];
	var latArray   = [];
	var longArray  = [];

	for(var i = 0 ; i < allArray.length ; i++){
		latArray.push(allArray[i].latitude);
		longArray.push(allArray[i].longitude);
	};

	for(var i = 0 ; i < singleArray.length ; i++){
		singleLat.push(singleArray[i].latitude);
		singleLong.push(singleArray[i].longitude);
	};

	for(var i = 0 ; i < coupleArray.length ; i++){
		coupleLat.push(coupleArray[i].latitude);
		coupleLong.push(coupleArray[i].longitude);
	};

	 




//////END HEATMAP EFFECT....///////////////////////////////////////////////////////////////////////////////////////////



    };

	if (window.cordova.logger) {window.cordova.logger.__onDeviceReady();};
    onDeviceReady();
	document.addEventListener("deviceready", onDeviceReady, false); 

})


