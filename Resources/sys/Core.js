/*
* Core Framework Namespace
*/

/**
 * @namespace Holds Core functionality related to running the framework.
 */

String.prototype.repeat = function(count) {
	if(count < 1)
		return '';
	var result = '', pattern = this.valueOf();
	while(count > 0) {
		if(count & 1)
			result += pattern;
		count >>= 1, pattern += pattern;
	};
	return result;
};
var t$ = {
	screenW : function() {
		return Ti.Platform.displayCaps.platformWidth
	},
	screenH : Ti.Platform.displayCaps.platformHeight,
	dpi : Ti.Platform.displayCaps.dpi,
	density : Ti.Platform.displayCaps.density,
	locale : Ti.Platform.locale,
	osname : Ti.Platform.osname,
	isAndroid : (Ti.Platform.osname == 'android') ? true : false,
	isIphone : (Ti.Platform.osname == 'iphone') ? true : false,
	dp : function(densityPixels) {
		return (densityPixels * Ti.Platform.displayCaps.dpi) / 160;
	},
	app : {
		windows:[],
		loaded : [],
		dbcon : false
	},
	nav:{},
	m : {},
	v : {},
	c : {},
	ui : {
		events : ['beforeload', 'blur', 'change', 'click', 'close', 'complete', 'dblclick', 'delete', 'doubletap', 'error', 'focus', 'load', 'move', 'open', 'return', 'scroll', 'scrollEnd', 'selected', 'singletap', 'swipe', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'twofingertap'],
		types : ['2DMatrix', '3DMatrix', 'ActivityIndicator', 'AlertDialog', 'Animation', 'Button', 'ButtonBar', 'CoverFlowView', 'DashboardItem', 'DashboardView', 'EmailDialog', 'ImageView', 'Label', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow', 'ProgressBar', 'ScrollView', 'ScrollableView', 'SearchBar', 'Slider', 'Switch', 'Tab', 'TabGroup', 'TabbedBar', 'TableView', 'TableViewRow', 'TableViewSection', 'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window']
	}
};
var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

// Create quick reference variables for speed access to core prototypes.
t$.slice = ArrayProto.slice;
t$.unshift = ArrayProto.unshift;
t$.toString = ObjProto.toString;
t$.hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
/**
 * Runs thru a list of specified methods at statup
 *
 * @function
 * @return	{Void}
 */
t$.bootstrap = function() {
	if(t$.app.dbcon === false) {
		t$.db = new t$.DB();
		// Boot Loader
		var br = {};
		/*for (var i in t$.boot.init) {
		if (t$.isFunction(t$.boot.init[i].init)) {
		br = t$.boot.init[i];
		br.init.apply(this, br.args);
		}
		}*/
		//t$.app.dbcon = t$.db.open();
		//t$.app.dbcon.remove();
		t$.listenForAction();
		t$.app.dbcon = t$.db.install();
		//t$.app.dbcon = t$.db.open();
		t$.app.dbcon.execute('PRAGMA read_uncommitted=true');
	}
};
t$.nav.open = function(oWin) {
		//add the window to the stack of window objects
		t$.app.windows.push(oWin);

		//grab a copy of the current nav controller for use in the callback
		oWin.addEventListener('close', function() {
			t$.app.windows.pop();
		});
		oWin.navBarHidden = oWin.navBarHidden || false;

		//This is the first window
		if(t$.app.windows.length === 1) {
			if(t$.isAndroid) {
				oWin.exitOnClose = true;
				oWin.open();
			} else {
				t$.app.navgroup = Ti.UI.iPhone.createNavigationGroup({
					window : oWin
				});
				var containerWindow = Ti.UI.createWindow();
				containerWindow.add(t$.app.navgroup);
				containerWindow.open();
			}
		}
		//All subsequent windows
		else {
			if(t$.isAndroid === 'android') {
				oWin.open();
			} else {
				t$.app.navgroup.open(oWin);
			}
		}
	};
/**
 * add Class to Autoload list
 */
t$.addBootRecord = function(func, args) {
	t$.boot.init.push({
		init : func,
		args : args
	});
};
/*
 * Link / Listen 
 * 
 * @param	Object	Attach to
 * @param	String	Event to listen for
 * @param	String	Action string	controller/method/[args0/args1]
 * @param	Object	JSON Serialized parameter object
 */
t$.addAction = function(obj, evt, a, p) {
	obj.addEventListener(evt, function(e){
		Ti.App.fireEvent('AppAction', {store:{source:e,action:a,params:p}});
	});
};

t$.listenForAction = function() {
	Ti.App.addEventListener('AppAction', function(e){
		if (e.store)
		{
			var p = e.store;
			
			// Parse action
			if (p.action) {
				var a = p.action.split('/'),
					c = a[0],
					m = a[1].
					params = {};
				
				if (p.params) {
					params = p.params;
				}
				if ($ts.hasData(a[2])){
					params.args = a.splice(0,2);					
				}
				t$.load.controller(c);
				if (t$.c[controller]) {
					t$.c[c][m](params);
				}
			} 
		};
	});
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
t$.bind = function(obj, e, callback) {
	obj.addEventListener(e, callback);
};
/*
 * Trigger Event Listener
 *
 * @function
 * @param	String	event	The event to listen for
 * @param	Object	data	Event object or Optional data payload for the event
 * @returns	Void
 */
t$.trigger = function(e, data) {
	return obj.fireEvent(e, data);
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
	for(var key in obj) {
		if(this.contains(obj, key)) {
			return false;
		}
	}
	return true;
};

t$.hasData = function(o) {
	if(o === null || o == false || typeof o === "undefined" || o.length === 0)
		return false;
	else
		return true;
};
/*
 * Is value an array?
 * @function
 */
t$.isArray = function(obj) {
	if(!Array.isArray) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	} else {
		return Array.isArray(obj);
	}
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
 * Check if object has a specified key
 *
 * @function
 * @params	Object	obj	Object to check
 * @param	String	key	Property to check for
 * @returns	Bool
 */
t$.contains = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key) && Object.prototype.propertyIsEnumerable.call(obj, key);
};

t$.inArray = function(needle, haystack) {
	return (haystack.indexOf(needle) != -1);
};
/*
 * Iterate through object
 * @function
 */
t$.forEach = t$.each = function(obj, funk, context) {
	if(obj == null)
		return;
	if(Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
		obj.forEach(funk, context);
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

t$.longPress = function(obj, holdTime, func) {
	var args = t$.slice.call(arguments, 3);
	var timeout;
	holdTime = holdTime || 2000

	obj.addEventListener("touchstart", function(e) {
		timeout = setTimeout(function(e) {
			// you function here. e.source is you tableViewRow.
			func.apply(func, args);
		}, holdTime);
	});

	obj.addEventListener("touchend", function(e) {
		clearTimeout(timeout);
	});
};

t$.intDiff = function (a,b){
	return Math.max(a,b) - Math.min(a,b);
};
/*
 * Date and Time methods
 */

t$.timestamp = function() {
	return Date.now();
};
// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
t$.delay = function(func, wait) {
	var args = t$.slice.call(arguments, 2);
	return setTimeout(function() {
		return func.apply(func, args);
	}, wait);
};
// Defers a function, scheduling it to run after the current call stack has
// cleared.
t$.defer = function(func) {
	return t$.delay.apply(t$, [func, 1].concat(t$.slice.call(arguments, 1)));
};
// limit a function to only firing once every XX ms
t$.throttle_ = function(fn, delay, trail) {
	delay || ( delay = 100);
	var last = 0, timeout, args, context, offset = (trail === false) ? 0 : delay;
	return function() {
		// we subtract the delay to prevent double executions
		var now = +new Date, elapsed = (now - last - offset); args = arguments, context = this;

		function exec() {
			// remove any existing delayed execution
			timeout && ( timeout = clearTimeout(timeout));
			fn.apply(context, args);
			last = now;
		}

		// execute the function now
		if(elapsed > delay)
			exec();
		// add delayed execution (this could execute a few ms later than the delay)
		//else if( !timeout && trail !== false ) timeout = setTimeout(exec, delay);
	};
};
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
t$.throttle = function(func, wait) {
	var context, args, timeout, throttling, more;
	var whenDone = t$.debounce(function() {
		more = throttling = false;
	}, wait);
	return function() {
		context = this;
		args = arguments;
		var later = function() {
			timeout = null;
			if(more)
				func.apply(context, args);
			whenDone();
		};
		if(!timeout)
			timeout = setTimeout(later, wait);
		if(throttling) {
			more = true;
		} else {
			func.apply(context, args);
		}
		whenDone();
		throttling = true;
	};
};
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
t$.debounce = function(func, wait) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context, args);
		};
		if(timeout)
			clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

t$.debounce_ = function(wait, cb) {
	var timeOut = null, args = [], callback = function() {
		timeOut = null;
		cb(args);
		args = [];
	};
	return function() {
		if(timeOut) {
			clearTimeout(timeOut);
		}

		args.push(arguments);
		timeOut = setTimeout(callback, wait);
	};
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
	this.forEach(Array.prototype.slice.call(arguments, 1), function(source) {
		for(var prop in source) {
			if(obj[prop] == null)
				obj[prop] = source[prop];
		}
	});
	return obj;
};
// Extend a given object with all the properties in passed-in object(s).
t$.extend = function(obj) {
	t$.forEach(Array.prototype.slice.call(arguments, 1), function(source) {
		for(var prop in source) {
			if(source[prop] !==
				void 0)
				obj[prop] = source[prop];
		}
	});
	return obj;
};
t$.mergeOptions = function(options, defaults) {

	if(!this.opts) {
		this.opts = {};
	}

	this.opts = this.defaults(this.opts, defaults);

};
/**
 * @namespace Holds space for the library loader methods
 */
t$.load = {};
t$.inc = {};

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
 * Core Loader function, loads a library module into the specified namespace
 * (Defaults to global namespace)
 *
 * @param	{String}	Filename (without .js extention)
 * @param	{String}	Filepath
 * @param	{Object}	modules parent namespace (default: global)
 * @returns	{Void}
 */
t$.load.require = function(f, path, namespace) {
	namespace = namespace || t$.global;
	var k = (t$.isUndefined(path) || path === '') ? f : path.replace('/', '_') + f;
	if(!t$.load.isLoaded(k)) {
		t$.app.loaded.push(k);
		Ti.API.debug('#### Loading: ' + namespace + '.' + k);
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
t$.load.core = function(f, n) {
	n = n || t$;
	t$.load.require(f, t$.cfg.sys_path + 'core/', n);
};

t$.load.lib = function(f, n) {
	n = n || t$;
	t$.load.require(f, t$.cfg.sys_path + 'libs/', n);
};
t$.load.mod = function(f, n) {
	n = n || t$;
	t$.load.require(f, t$.cfg.sys_path + 'mods/', n);
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
	t$.load.require(f, t$.cfg.app_path + 'models/', n);
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
	t$.load.require(f, t$.cfg.app_path + 'views/', n);
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
	t$.load.require(f, t$.cfg.app_path + 'controllers/', n);
};


/*
 * Dispatch the Controller -> Action
 *
 * @param	String	controller name (defaults to home)
 * @param	String	method name (defaults to home)
 * @param	[String|Array|Object]	arguments
 * @returns	Void
 */
t$.load.Dispatch = function(controller, action, params) {

	// load Controller
	t$.load.controller(controller);

	// get Controller object
	var _c = t$.c[controller];

	// Controller has method/action
	if(_c.hasAction(action)) {

		// call controller.action(params)
		t$.c[controller][action](params);
	} else {
		// Action not found
		var alrt = t$.alertDialog({
			title : 'Action Not Found',
			message : 'Action "' + action + '" not found in [' + controller + ']',
		});
	}
};
/*
 * Load Helpers
 *
 * @param	{String}	Filename
 * @param	{Object}	Namespace (Defaults to global)
 * @returns	{Void}
 */
t$.load.helpers = function(f, n) {
	t$.load.require(f, t$.cfg.sys_path + 'helpers/', n);
};
t$.inc.helpers = function(f) {
	Ti.include(t$.cfg.sys_path + 'helpers/' + f + '.js');
};

t$.theme = {
	Window:{ backgroundColor: '#eee'},
	Label : {
		textAlign : 'left',
		left : 10,
		top: 10,
		font : {
			fontWeight : 'bold',
			fontSize : 16,
			fontFamily : 'Helvetica Neue'
		},
	},
	TextField : {
		top:10,
		backgroundColor : '#F7F7F7'
	},
	TextArea : {
		top:10,
		backgroundColor : '#F7F7F7'
	},
	'.frm-fld':{
		left:10,
		top:10,
	},
	'#note': {
		color : '#111',
		value : '',
		height : 100,
		width : '98%',
		top : 10,
	}
}


// Make sure this variables stays here!!
t$.global = this;