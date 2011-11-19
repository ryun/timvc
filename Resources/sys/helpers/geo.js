t$.geo.bounds = function(/*Array*/ bounds) {
	this.points = bounds||[];
};

t$.geo.bounds.protoype = {
	clear: function(){
		this.points = [];
	},
	
	add: function(lat, lng){
		this.points.push([lat,lng]);
	},
	
	get: function() {
		var poiCenter = {}; var delta = 0.02; var minLat = this.points[0][0], maxLat = this.points[0][0], minLon = this.points[0][1], maxLon = this.points[0][1];
		for (var i = 1; i < this.points.length; i++) {
			minLat = Math.min(this.points[i][0], minLat);
			maxLat = Math.max(this.points[i][0], maxLat);
			minLon = Math.min(this.points[i][1], minLon);
			maxLon = Math.max(this.points[i][1], maxLon);
		}
		var deltaLat = maxLat - minLat;
		var deltaLon = maxLon - minLon;
		delta = Math.max(deltaLat, deltaLon) * 0.55;
		poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
		poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);
		return {
			latitude: poiCenter.lat,
			longitude: poiCenter.lon,
			latitudeDelta: delta,
			longitudeDelta: delta
		};
	}
};

t$.geo.location = function() {

	Ti.Geolocation.purpose = "Populate Address Fields Based on Your Location";
	Ti.Geolocation.preferredProvider = "gps";

	// GPS IS OFF
	if(Titanium.Geolocation.locationServicesEnabled == false) {
		alert('Your GPS is turned off. Please switch it on.');
	}
	else {
		//GPS IS ON
	
		// EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
		if (Titanium.Geolocation.hasCompass)
		{
			Titanium.Geolocation.headingFilter = 90;
		}

		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.distanceFilter = 10;
	}
};
t$.geo.location.prototype = {
	__construct: function(){

	},
	getPosition: function(suc_callback, err_callback) {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				err_callback.call(e);
			}
			else {
				suc_callback.call(e);
			}
		});
	},
	geocode: function(lat,lng, callback) {
		Titanium.Yahoo.yql('select * from yahoo.maps.findLocation where q="' + lat + ',' + lng + '" and gflags="R"', callback);
	}
};



t$.geo.map = function(){};
t$.geo.map.prototype = { 
	createMarker: function(lat, lng, o){
		var opts = {
			lat : lat,
			lng : lng,
			animate : true
		}
		opts.title = o.title || '';
		opts.subtitle = o.subtitle || '';
		opts.animate = o.animate || true;
		
		t$.geo.bounds.add(opts.lat, opts.lng);
		return Ti.Map.createAnnotation(opts);
	}
};
