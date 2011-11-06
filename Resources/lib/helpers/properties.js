t$.Props = {
	has: function(key) {
		return Ti.App.Properties.hasProperty(key);
	},
	put: function(key, val) {
		Ti.App.Properties.setString(key,JSON.stringify(val));
	},
	
	get: function(key) {
		var val = Ti.App.Properties.getString(key);
		try {
			return JSON.parse(val);
		} catch (e) {
			return val;
		}
	}
};