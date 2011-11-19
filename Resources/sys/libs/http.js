/*
 * Super simple HTTP Helper (With Cache)
 * 
 * Properties:
 * ------------------------------------------
 * url:			url
 * method:		HTTP method to use
 * params: 		Data to send with request, data types [null, JSON, Str, FileObject, Blob]
 * type:		Expected response data type
 * callback: 	Function to be called on successful request
 * error: 		Function to be called on request error
 * valid_for:	Cache Lifetime (in seconds)
 * skip_cache:	Skip Cache (Bool)
 * debug:		Debug connection for dev. (Bool)
 */

exports.http = function(args) {
	var self = this, default_opts = {

		// Http Method [GET|POST|PUT]
		method : 'POST',

		// Cache Model or Class
		cacheModel : t$.m.Cache,

		// URL for the request
		url : '',

		// Response type
		type : 'json',

		// the data to send in the request.
		// Acceptable data types [null, JSON, String, File object or Blob.
		params : '',

		// Cache Lifetime (in seconds)
		valid_for : 600,

		// Skip Cache (Bool)
		skip_cache : false,
		// Debug connection for dev. (Bool)
		debug : true,
		// The callback function on sucess
		callback : function(data) {
		}
	};

	// Merge default properties with args
	args = t$.defaults(args, default_opts);

	// Create md5 Hash of url and [parms] if exists
	args.key = Titanium.Utils.md5HexDigest(args.url + (args.params) ? JSON.stringify(args.params) : '');

	if(!args.skip_cache) {

		// Query the Cache DB
		var cache_data = args.cacheModel.get(args.key);

		// We have some data!
		if(cache_data !== null) {
			// Execute callback
			args.callback(cache_data);
			Ti.API.debug('############# FROM CACHE' + args.url);
			return;
		}
	}

	var xhr = Ti.Network.createHTTPClient();

	// HTTP OK
	xhr.onload = function() {
		if(this.responseText !== null) {
			var response = (args.type == 'json') ? JSON.parse(this.responseText) : this.responseText;

			// Cache the data
			args.cacheModel.put(args.key, response, args.valid_for);

			if( typeof (args.callback) == 'function') {
				args.callback(response);
				Ti.API.debug('############# FROM HTTP' + args.url);
			} else {
				Ti.API.debug('Parse Client: Request Successful');
			}
		}
	};
	// HTTP ERROR
	xhr.onerror = function() {
		var response = JSON.parse(this.responseText);
		if(args.error) {
			args.error(response, this);
		} else {
			Ti.API.error('Parse Client: Request Failed: ' + args.url);
		}
	};
	// Open connection
	xhr.open(args.method, args.url);

	// Send Data
	if(args.method === 'PUT' || args.method === 'POST') {
		xhr.send(JSON.stringify(args.params));
	} else {
		xhr.send('');
	}
};
