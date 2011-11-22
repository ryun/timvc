/*
 * Selector = Object = ObjectId = ObjectClass
 * Context = Window
 */
var __global = root = this;

var kwery = function(selector, context) {
	if(this instanceof kwery) {
		dbg('Kwery is a instance of kwery');
	} else {
		dbg('Kwery is NOT a instance of kwery, Creating instance!');
	}
	return this instanceof kwery ? this.init(selector, context) : new kwery(selector, context);
};

kwery.fn = kwery.prototype = {
	constructor : kwery,
	// Is it a object
	init : function(selector, context) {
		if(!selector) {
			return this;
		}
		context = context || {};
		context.dom=context.dom || {};
		if(!context) {
			if(Ti.UI.currentWindow) {
				this.context = Ti.UI.currentWindow;
				this.context.dom={};
			}
		}
		function parseTag(str) {
			var a, myRe = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi,
				o = {tag: str.substr(1,str.indexOf(' ')-1), attr:{}};
				
			while ((a = myRe.exec(str)) != null)  
			{  
				o.attr[a[1]] = a[2];
			}
			return o;
		}
		
		// Match [Windows #id_name]
		var rxNewEl = /^\<(.*?)\>$/;
		if(rxNewEl.test(selector)) {
			var newObj = parseTag(selector);
			dbg('##################### NEWTAG:'+newObj.tag+'"');
			selector = kwery.fn.create(newObj.tag, newObj.attr.id, newObj.attr);
		}
		//rxMatch.exec(x)[1];

		if(!context) {
			this.context = selector;
		}
		this.selector = selector;

		// object
		if( typeof selector == 'object') {
			//this.context = [this[0] = selector];
			this.length = 1;
			return this;
		}
		return this;
	},
	bind : function(e, fn) {
	for (var i in this.selector){
			dbg('### DEBUG: SEL:: ' + i + ':' + this.selector[i]);
		}
		this.selector.addEventListener(e, fn);
		return this;
	},
	unbind : function(e, fn) {
		this.selector.removeEventListener(e);
		return this;
	},
	add : function(o) {
		dbg('## CONTEXT: ' + JSON.stringify(this.context));
		dbg('## OBJ: ' + this.selector.id);
		for (var i in this.context){
			//dbg('### DEBUG: selector::: ' + i + ':' + this.context[i]);
		}
		//this.context[this.selector.id] = o;
		this.context[this.selector.id] = o;
		this.selector.add(o);
		return this;
	},
	addTo : function(o) {
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
		this.selector[p] = v;
		return this;
	},
	getParent : function() {
		if( typeof this.selector.getParent === 'function') {
			return this.selector.getParent();
		} else
			return false;
	},
	children : function() {
		if( typeof this.selector.children !== null) {
			return this.selector.children;
		} else
			return [];
	},
	create : function(type, id, o) {
		o = o || {};
		//Check for element styles
		if(t$.theme[type]) {
			kwery.fn.extend(o, t$.theme[type]);
		}

		// Check for class styles
		if(o.className) {
			var cl = o.className.split(' ');
			for(var i in cl) {
				if(kwery.fn.hasData(t$.theme['.' + cl[i]])) {
					kwery.fn.extend(o, t$.theme['.' + cl[i]]);
				}
			}
		}
		// Check for class styles
		if(kwery.fn.hasData(t$.theme['#' + id])) {
			kwery.fn.extend(o, t$.theme['#' + id]);
		}
		if(type == 'Picker') {
			var obj = t$.ui.picker(o, o.data || []);
		} else {
			var obj = Ti.UI['create' + type](o);
		}
		obj.id = id;
		if(type == 'Window') {
			this.context = obj;
		}
		this.selector = __global[id] = obj;

		return this.selector;
	},
	defaults : function(obj) {
		var source = Array.prototype.slice.call(arguments, 1);
		for(var i in source) {
			for(var prop in source[i]) {
				if(obj[prop] == null)
					obj[prop] = source[i][prop];
			}
		}
		return obj;
	},
	// Extend a given object with all the properties in passed-in object(s).
	extend : function(obj) {
		var source = Array.prototype.slice.call(arguments, 1);
		for(var i in source) {
			for(var prop in source[i]) {
				if(source[prop] !==
					void 0)
					obj[prop] = source[i][prop];
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
};
root.kwery = root.$ = kwery;
