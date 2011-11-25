/*
 * Selector = Object = ObjectId = ObjectClass
 * Context = Window
 */
function dbgl(o, msg) {
	for(var n in o) {
		dbg('##### DEBUG: ' + msg + ': ' + n + ' : ' + o[n]);
	}
}

var TiDom = function() {
	this.dom = {
		i : [],
		t : [],
		c : []
	};
};
TiDom.prototype = {
	addId : function(n, o) {
		this.add('i', n, o);
	},
	addTag : function(n, o) {
		this.add('t', n, o);
	},
	addClass : function(n, o) {
		this.add('c', n, o);
	},
	getById : function(id) {
		return this.dom.i[id] || [];
	},
	getByClass : function(cl) {
		return this.dom.c[cl] || [];
	},
	getByTag : function(tg) {
		return this.dom.t[tg] || [];
	},
	/*
	 * @param Container to update
	 * @param Id Name
	 * @param Object
	 */
	add : function(ns, n, o) {
		if(!this.dom[ns][n]) {
			dbg('#### CREATE ARRAY for: ' + n + ':' + ns);
			this.dom[ns][n] = [];
		}
		//dbg('######## ADD DOM: ' + );
		this.dom[ns][n].push(o);
	},
	addObject : function(o) {
		this.addId(o.id, o);
		if(o.className)
			this.addClass(o.className, o);
		//if (o.className) this.addClass(o.className, o);
	},
	getParent : function(o) {
		if( typeof o.getParent === 'function') {
			return o.getParent();
		} else {
			return false;
		}
	},
	getChildren : function(o) {
		if( typeof o.children !== null) {
			return o.children;
		} else
			return [];
	},
	// Filter Methods
	filterByClass : function(o, n) {
		var a = [], self = this;
		dbgl(o, 'YOOOOOOOOOOOOOO!!!');
		var walker = function(obj) {
			dbg('BEFOR CHILD');
			var c = self.getChildren(obj);
			dbg('AFTER CHILD');
			dbgl(c, 'CLASS FILTER');
			if(c) {
				for(var i in c) {
					dbg('######### Filter By Class: ' + c[i]);
					if(c[i].className === n) {
						a.push(c[i]);
					}
					walker(c[i]);
				};
			}
		};
		walker(o);
		return a;
	},
	filterByTag : function(o, n) {
		var a = [];
		this.each(o, function(c) {
			if(c.type === n) {
				a.push(c);
			}
		});
	},
	getById : function(id) {
		return this.dom.i[id] || [];
	},
	getByClass : function(id) {
		return this.dom.c[id] || [];
	},
	getByTag : function(id) {
		return this.dom.t[id] || [];
	},
	each : function(obj, funk, context) {
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
				dbg('########## each dbg: ' + key + ' : ' + obj[key].id);
				if(Object.prototype.hasOwnProperty.call(obj, key) && Object.prototype.propertyIsEnumerable.call(obj, key)) {
					if(funk.call(context, obj[key], key, obj) === {})
						return;
				}
			}
		}
	},
};

var kwery = function(selector, context) {
	if(this instanceof kwery) {
		dbg('Kwery is a instance of kwery');
	} else {
		dbg('Kwery is NOT a instance of kwery, Creating instance!');
	}
	return this instanceof kwery ? this.init(selector, context) : new kwery(selector, context);
};
/*
 id = /#([\w\-]+)/
 , clas = /\.[\w\-]+/g
 , idOnly = /^#([\w\-]+)$/
 , classOnly = /^\.([\w\-]+)$/
 , tagOnly = /^([\w\-]+)$/
 , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/

 order: [ "ID", "NAME", "TAG" ],

 match: {
 ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
 CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
 NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
 ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
 TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
 CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
 POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
 PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
 },

 leftMatch: {},
 */
kwery.fn = kwery.prototype = {
	constructor : kwery,
	// Is it a object
	init : function(selector, context) {
		if(!selector) {
			return this;
		}
		//context = context || {};
		//context.dom=context.dom || {};
		if(!context) {
			if(Ti.UI.currentWindow) {
				this.context = Ti.UI.currentWindow;
				this.context.dom = {};
			}
		}
		function parseTag(str) {
			var a, myRe = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi,
			//o = {tag: str.substr(1,str.indexOf(' ')-1), attr:{}};
			tag = /^\s*<([^\s>]+)/.exec(str)[1], o = {
				tag : tag,
				attr : {}
			};

			while(( a = myRe.exec(str)) != null) {
				o.attr[a[1]] = a[2];
			}
			return o;
		}

		var regxMatch = {
			ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			TAG_CLASS : /^([\w]+)?\.([\w\-]+)$/,
			TAG : /^\[Ti\.UI\.(.*?)\]$/
		};

		if(kwery.fn.isString(selector)) {
			// Create Element
			var rxNewEl = /^\<(.*?)\>$/;
			if(rxNewEl.test(selector)) {
				var newObj = parseTag(selector);
				dbg('##################### NEWTAG:' + newObj.tag + '"');
				selector = kwery.fn.create(newObj.tag, newObj.attr.id, newObj.attr);
			} else {
				// Parse Query
				var _parts = selector.split(' ');
				var _order = ['ID', 'CLASS', 'TAG'], ord = [];

				if(_parts.length === 1) {
					if(( r = regxMatch.ID.exec(_parts[0])) != null) {
						dbg('======= REGEX ID: ' + r[1]);
						dbg(this.context.id);
						selector = [__global[r[1]]];
					}
				} else {
					var _target = false, _child = false, _tag = false, _i = false, _ord = [];

					for(var i = 0; i < _parts.length; i += 1) {
						dbg(_parts[i]);
						// ID
						if(( _i = regxMatch.ID.exec(_parts[i])) != null) {
							var _id = DOM.getById(_i[1]);
							dbgl(_id, 'GET BY ID');
							//dbg('NOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!' + _i[1] + ':' + (typeof _id));
							//dbgl(__global[_i[1]].children, '##########BY ID');
							//_target = DOM.getById(_i[1]);
							_target = __global[_i[1]];

						} else if(( _i = regxMatch.CLASS.exec(_parts[i])) != null) {
							// Class Root
							/*DOM.each(_target, function(x) {
							 dbg('##### Selected: ' + x);
							 });*/

							if(!_target) {
								_target = DOM.getByClass(_i[1]);
							}
							// Class Child
							else if(_target) {
								dbgl(_target, 'CLASS1');
								_target = DOM.filterByClass(_target, _i[1]);
								dbgl(_target, 'CLASS2');
							}

						} else if(( _i = regxMatch.TAG.exec(_parts[i])) != null) {
							// Class Root
							if(!_target) {
								_target = DOM.getByTag(_i[1]);
							}
							// Class Child
							else if(_target) {
								_target = DOM.filterByTag(_target, _i[1]);
							}
							dbgl(_target, 'TAG');
						}
					}
				}
				for(var n in _target) {
					dbg('##### Selected: ' + _target[n].id);
				}
				selector = _target;
			}

		}

		this.selector = selector;

		// object
		/*if( typeof selector == 'object') {
		 //this.context = [this[0] = selector];
		 this.length = 1;
		 return this;
		 }*/
		return this;
	},
	bind : function(e, fn) {
		/*for (var i in this.selector){
		 dbg('### DEBUG: SEL:: ' + i + ':' + this.selector[i]);
		 }*/
		this.selector.addEventListener(e, fn);
		return this;
	},
	unbind : function(e, fn) {
		this.selector.removeEventListener(e);
		return this;
	},
	add : function(o) {
		//this.selector.child.push(o);
		o.parent = this.selector;
		//o.context = this.selector;
		this.selector.add(o);
		return this;
	},
	addTo : function(o) {
		//o.child.push(this.selector);
		this.selector.parent = o;
		//this.context = o;
		o.add(this.selector);
	},
	show : function() {
		this.selector.show();
		return this;
	},
	hide : function() {
		this.selector.hide();
		return this;
	},
	open : function() {
		this.selector.open();
		return this;
	},
	close : function() {
		this.selector.close();
		return this;
	},
	set : function(p, v) {
		if(kwery.fn.isObject(p)) {
			//dbg('============= p is a object ===============');
			kwery.fn.extend(this.selector, p);
			if(this.contains(p, 'className')) {
				DOM.addClass(p.className, this.selector);
			}

		} else {
			this.selector[p] = v;
			if(p === 'className') {
				DOM.addClass(v, this.selector);
			}

		}
		return this;
	},
	anim : function(p) {

		DOM.each(this.selector, function(o) {
			o.animate(p);
		});
		return this;
	},
	get : function() {
		return this.selector;
	},
	getParent : function() {
		if( typeof this.selector.getParent === 'function') {
			return this.selector.getParent();
		} else {
			return false;
		}
	},
	children : function() {
		if( typeof this.selector.children !== null) {
			return this.selector.children;
		} else
			return [];
	},
	contains : function(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key) && Object.prototype.propertyIsEnumerable.call(obj, key);
	},
	create : function(type, id, o) {
		o = o || {};
		//Check for element styles
		if(t$.theme[type]) {
			kwery.fn.extend(o, t$.theme[type]);
		}

		// Merge for class styles
		if(o.className) {
			var cl = o.className.split(' ');
			for(var i in cl) {
				if(kwery.fn.hasData(t$.theme['.' + cl[i]])) {
					kwery.fn.extend(o, t$.theme['.' + cl[i]]);
				}
			}
		}
		// Merge for ID styles
		if(kwery.fn.hasData(t$.theme['#' + id])) {
			kwery.fn.extend(o, t$.theme['#' + id]);
		}
		if(type == 'Picker') {
			var obj = t$.ui.picker(o, o.data || []);
		} else {
			var obj = Ti.UI['create' + type](o);
		}
		obj.id = id;
		obj.child = [];
		obj.type = type;

		if(type == 'Window') {
			this.context = obj;
		} else {

		}
		this.selector = __global[id] = obj;
		DOM.addTag(type, obj);
		// ID
		DOM.addId(id, obj);
		//dbgl(obj, '####$$$$ ID DOMMM:::: ');
		//Class
		if(obj.className) {
			DOM.addClass(obj.className, obj);
		}
		// Add to DOM
		// Tag

		return this.selector;
	},
	defaults : function(obj) {
		var source = Array.prototype.slice.call(arguments, 1);
		for(var i in source) {
			for(var prop in source[i]) {
				if(obj[prop] == null) {

					obj[prop] = source[i][prop];
				}
			}
		}
		return obj;
	},
	// Extend a given object with all the properties in passed-in object(s).
	extend : function(obj) {
		var source = Array.prototype.slice.call(arguments, 1);
		for(var i in source) {
			for(var prop in source[i]) {
				if(source[i][prop] !==
				void 0) {
					dbg('obj:' + prop + ' - src: ' + i + ':' + prop);
					obj[prop] = source[i][prop];
				}
			}
		};
		return obj;
	},
	hasData : function(o) {
		if(o === null || o == false || typeof o === "undefined" || o.length === 0)
			return false;
		else
			return true;
	},
	isArray : function(obj) {
		if(!Array.isArray) {
			return Object.prototype.toString.call(obj) == '[object Array]';
		} else {
			return Array.isArray(obj);
		}
	},
	/*
	 * Is variable an object?
	 * @function
	 */
	isObject : function(obj) {
		return obj === Object(obj);
	},
	isString : function(obj) {
		return Object.prototype.toString.call(obj) == '[object String]';
	}
};
var $ = kwery;
