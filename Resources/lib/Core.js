/*
 * Core Framework Namespace
 */
var t$ = {
	app: {
		loaded:[],
		dbcon:false
	},
	m: {},
	v: {},
	c: {},
};

/**
 * Runs thru a list of specified methods at statup
 *
 * @type	{function}
 * @return	{Void}
 */
t$.bootstrap = function() {
	if(t$.app.dbcon === false) {
		t$.db = new t$.DB();
		t$.app.dbcon = t$.db.open();
	}
};
// Return the results of applying the iterator to each element.
// Delegates to **ECMAScript 5**'s native `map` if available.
t$.map = function(obj, iterator, context) {
	var results = [];
	if(obj == null)
		return results;
	this.forEach(obj, function(value, index, list) {
		results[results.length] = iterator.call(context, value, index, list);
	});
	return results;
}, t$.toString = function() {
	return Object.prototype.toString();
};
// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
t$.isEmpty = function(obj) {
	if(this.isArray(obj) || this.isString(obj))
		return obj.length === 0;
	for(var key in obj)
	if(this.contains(obj, key))
		return false;
	return true;
};
// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
t$.isArray = function(obj) {
	return this.toString.call(obj) == '[object Array]';
};
// Is a given variable an object?
t$.isObject = function(obj) {
	return obj === Object(obj);
};
// Is a given variable an arguments object?
t$.isArguments = function(obj) {
	return this.toString.call(obj) == '[object Arguments]';
};
// Is a given value a function?
t$.isFunction = function(obj) {
	return this.toString.call(obj) == '[object Function]';
};
// Is a given value a string?
t$.isString = function(obj) {
	return this.toString.call(obj) == '[object String]';
};
// Is a given value a number?
t$.isNumber = function(obj) {
	return this.toString.call(obj) == '[object Number]';
};
// Is the given value `NaN`?
t$.isNaN = function(obj) {
	// `NaN` is the only value for which `===` is not reflexive.
	return obj !== obj;
};
// Is a given value a boolean?
t$.isBool = function(obj) {
	return obj === true || obj === false || this.toString.call(obj) == '[object Boolean]';
};
// Is a given value a date?
t$.isDate = function(obj) {
	return this.toString.call(obj) == '[object Date]';
};
// Is the given value a regular expression?
t$.isRegExp = function(obj) {
	return this.toString.call(obj) == '[object RegExp]';
};
// Is a given value equal to null?
t$.isNull = function(obj) {
	return obj === null;
};
// Is a given variable undefined?
t$.isUndefined = function(obj) {
	return obj ===
	void 0;
};
t$.contains = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key) && Object.prototype.propertyIsEnumerable.call(obj, key);
};

t$.forEach = function(obj, funk, context) {
	if(obj == null)
		return;
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


/*
 * Name space for library loader
 * 
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
