/*
 * Core Framework Namespace
 */


//(function(sel, context){}) ();

/**
 * @namespace Holds Core functionality related to running the framework.
 */

var t$ = {
	dpi: Ti.Platform.displayCaps.dpi,
	density: Ti.Platform.displayCaps.density,
	locale: Ti.Platform.locale,
	osname: Ti.Platform.osname,
	isAndroid: (Ti.Platform.osname == 'android') ? true : false,
	isIphone: (Ti.Platform.osname == 'iphone') ? true : false,
	dp: function (densityPixels) {
		return (densityPixels * Ti.Platform.displayCaps.dpi) / 160;
	},
	app: {
		loaded:[],
		dbcon:false
	},
	m: {},
	v: {},
	c: {},
	ui: {},
};


/**
 * Runs thru a list of specified methods at statup
 *
 * @function
 * @return	{Void}
 */
t$.bootstrap = function() {
	if(t$.app.dbcon === false) {
		t$.db = new t$.DB();
		t$.app.dbcon = t$.db.open();
		t$.app.dbcon.remove();
		t$.app.dbcon = t$.db.install();
		//t$.app.dbcon = t$.db.open();
		t$.app.dbcon.execute('PRAGMA read_uncommitted=true');
		
		
	}
};

/*
 * Bind Events Listener to a Object
 * 
 * @function
 * @param	Object		obj			The object we are listening to
 * @param	String		event		The event to listen for
 * @param	Function	callback	Function to call when the event is trigered
 * @returns	Void
 */
t$.bind = function(obj, event, callback) {
	obj.addEventListener(event, callback);
};

/*
 * Trigger Event Listener
 * 
 * @function
 * @param	String	event	The event to listen for
 * @param	Object	data	Event object or Optional data payload for the event
 * @returns	Void
 */
t$.trigger = function(event, data) {
	return obj.fireEvent(event, data);
};

/*
 * Maps a function to each element
 * @function
 * @param	Object		obj		Object to iterate
 * @param	Function	funk	Function to use with the map
 * @param	Object		context	Context to call from
 * @returns	Object
 */
t$.map = function(obj, iterator, context) {
	var results = [];
	if(obj == null)
		return results;
	this.forEach(obj, function(value, index, list) {
		results[results.length] = iterator.call(context, value, index, list);
	});
	return results;
};

t$.toString = function() {
	return Object.prototype.toString();
};

/*
 * Check if the variable is empty
 * @function
 * @param	Object, Array, String	The variable to check
 * @returns	Bool
 */

t$.isEmpty = function(obj) {
	if(this.isArray(obj) || this.isString(obj))
		return obj.length === 0;
	for(var key in obj)
	if(this.contains(obj, key))
		return false;
	return true;
};

t$.hasData = function(o) {
	if (o == false || typeof o === "undefined" || o.length < 1) return false;
	return true;
};
/*
 * Is value an array?
 * @function
 */
t$.isArray = function(obj) {
	return this.toString.call(obj) == '[object Array]';
};
/*
 * Is variable an object?
 * @function
 */
t$.isObject = function(obj) {
	return obj === Object(obj);
};
/*
 * Is variable an arguments object?
 * @function
 */
t$.isArguments = function(obj) {
	return this.toString.call(obj) == '[object Arguments]';
};
/*
 * Is value a function?
 * @function
 */
t$.isFunction = function(obj) {
	return this.toString.call(obj) == '[object Function]';
};
/*
 * Is value a string?
 * @function
 */
t$.isString = function(obj) {
	return this.toString.call(obj) == '[object String]';
};
/*
 * Is value a number?
 * @function
 */
t$.isNumber = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
	//return this.toString.call(obj) == '[object Number]';
};
/*
 * Is the given value `NaN`?
 * @function
 */
t$.isNaN = function(obj) {
	return obj !== obj;
};
/*
 * Is value a boolean?
 * @function
 */
t$.isBool = function(obj) {
	return obj === true || obj === false || this.toString.call(obj) == '[object Boolean]';
};
/*
 * Is value a date?
 * @function
 */
t$.isDate = function(obj) {
	return this.toString.call(obj) == '[object Date]';
};
/*
 * Is the given value a regular expression?
 * @function
 */
t$.isRegExp = function(obj) {
	return this.toString.call(obj) == '[object RegExp]';
};
/**
 * Is value equal to null?
 * @function
 */
t$.isNull = function(obj) {
	return obj === null;
};

/*
 * Is variable undefined?
 * @function
 */
t$.isUndefined = function(obj) {
	return obj ===
	void 0;
};

/*
 * Check if object has a key
 *
 * @function
 * @params	Object	obj	Object to check
 * @param	String	key	Property to check for
 * @returns	Bool 
 */
t$.contains = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key) && Object.prototype.propertyIsEnumerable.call(obj, key);
};

/*
 * Iterate through object
 * @function
 */
t$.forEach = function(obj, funk, context) {
	if(obj == null) return;
	if(Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
		obj.forEach(iterator, context);
	} else if(obj.length === +obj.length) {
		for(var i = 0, l = obj.length; i < l; i++) {
			if( i in obj && funk.call(context, obj[i], i, obj) === {})
				return;
		}
	} else {
		for(var key in obj) {
			if(this.contains(obj, key)) {
				if(funk.call(context, obj[key], key, obj) === {})
					return;
			}
		}
	}
};

/*
 * Trim spaces from a string on the left and right.
 * @function
 * @param	String	str	String to trim
 */
t$.trim = function(str) {
	var n = str.length, s, i;
	if(!n)
		return str;
	s = {
		0x0009 : true,
		0x000a : true,
		0x000b : true,
		0x000c : true,
		0x000d : true,
		0x0020 : true,
		0x0085 : true,
		0x00a0 : true,
		0x1680 : true,
		0x180e : true,
		0x2000 : true,
		0x2001 : true,
		0x2002 : true,
		0x2003 : true,
		0x2004 : true,
		0x2005 : true,
		0x2006 : true,
		0x2007 : true,
		0x2008 : true,
		0x2009 : true,
		0x200a : true,
		0x200b : true,
		0x2028 : true,
		0x2029 : true,
		0x202f : true,
		0x205f : true,
		0x3000 : true
	};
	if(n && s[str.charCodeAt(n - 1)]) {
		do {
			n--;
		} while (n && s[str.charCodeAt(n-1)]);
		if(n && s[str.charCodeAt(0)]) {
			i = 1;
			while(i < n && s[str.charCodeAt(i)])++i;
		}
		return str.substring(i, n);
	}
	if(n && s[str.charCodeAt(0)]) {
		i = 1;
		while(i < n && s[str.charAt(i)])++i;
		return str.substring(i, n);
	}
	return str;
};

t$.jsonParse = function(json) {
	return JSON.parse(json);
};

// Fill in a given object with default properties.
t$.defaults = function(obj) {
	this.forEach(slice.call(arguments, 1), function(source) {
		for(var prop in source) {
			if(obj[prop] == null)
				obj[prop] = source[prop];
		}
	});
	return obj;
};

t$.setOpts = function(options, defaults) {

	if(!this.opts) {
		this.opts = {};
	}

	this.opts = this.defaults(defaults, this.opts);

};

t$.toQueryStr = function(obj) {
	var a = [], that = this;
	obj = obj || {};

	this.forEach(obj, function(val, key) {
		var result = null;

		if(t$.isObject(val)) {
			result = that.toQueryStr(val);
		} else if(t$.isArray(val)) {
			result = that.toQueryStr(val);
		} else {
			result = encodeURIComponent(val);
		}
		if(result) {
			a.push(key + '=' + result);
		}
	});
	return '[' + a.join("&") + ']';
};


/**
 * @namespace Holds space for the library loader methods
 */
t$.load = {};

/*
 * Checks if file is already loaded
 * 
 * @params	{String}	Fullpath to the file
 * @returns	{Bool}
 */
t$.load.isLoaded = function(f) {
	return (t$.app.loaded.indexOf(f) === -1) ? false : true;
};

/*
 * Core Loader function, loads a library into the specified namespace
 * (Defaults to global if namespace is not specified)
 * 
 * @param	{String}	Filename (without .js extention)
 * @param	{String}	Filepath
 * @param	{Object}	Namespace to add the library to
 * @returns	{Void}
 */
t$.load.require = function(f, path, namespace) {
	namespace = namespace || t$.global;
	var k = (t$.isUndefined(path) || path === '') ? f : path.replace('/', '_') + f;
	if(!this.isLoaded(k)) {
		t$.app.loaded.push(k);
		namespace[f] = require(path + f)[f];
	} else {
		Ti.API.debug('Already Loaded: ' + k);
	}
};

/*
 * Load Core Library file
 * 
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to global)
 * @returns	{Void}
 */
t$.load.lib = function(f, n) {
	this.require(f, 'lib/', n);
};

/*
 * Load Model
 * 
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to t$.m)
 * @returns	{Void}
 */
t$.load.model = function(f, n) {
	n = n || t$.m;
	this.require(f, 'lib/models/', n);
};

/*
 * Load View
 * 
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to t$.v)
 * @returns	{Void}
 */
t$.load.view = function(f, n) {
	n = n || t$.v;
	this.require(f, 'lib/views/', n);
};

/*
 * Load Controller
 * 
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to t$.c)
 * @returns	{Void}
 */
t$.load.controller = function(f, n) {
	n = n || t$.c;
	this.require(f, 'lib/controllers/', n);
};

/*
 * Load Helpers
 * 
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to global)
 * @returns	{Void}
 */
t$.load.helpers = function(f, n) {
	return this.require(f, 'lib/helpers/', n);
};
