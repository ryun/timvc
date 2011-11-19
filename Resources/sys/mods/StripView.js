exports.StripView = function(args) {
	args = args || {};
	var self = this;
	this.views = args.views || [];
	this.tabs = args.views || [];
	this.root = Ti.UI.createView(t$.defaults({
		top : 0,
		bottom : 0,
		left : 0,
		right : 0
	}, args));

	this.container = Ti.UI.createScrollView({
		scrollType : "horizontal",
		layout : "horizontal",
		horizontalBounce : true,
		top : 0,
		left : 0
	});
	//makeSwipeable(this.container);
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		t$.forEach(self.views, function(v) {
			v.width = t$.screenW();
		});
	});
	var self = this;
	var sPage = 0;
	var scrollX = 0;
	var scrollS = 0;
	var startScroll = 0;
	var stopScroll = false;
	var touchStart = 0;
	var scrollTimeout = false;
	function pageTo(x, w) {
		return Math.round((x * t$.screenW()) / t$.screenW()) * t$.screenW();
	}

	function roundTo(x, w) {
		var xy = (Math.round(x / w) * w);
		return xy < 0 ? 0 : xy;
	}

	var scrolllistener = function(e) {
		scrollX = roundTo(e.x, t$.screenW());
		if(!startScroll)
			//startScroll = roundTo(e.x, t$.screenW());
			if(!stopScroll) {
				//scrollX = roundTo(e.x, t$.screenW());

			}
	};
	var endscroll = function(e) {
		Ti.API.debug("######### - DRAGGING: " + e.x);
		function doPosChangeMem(elem, sPos, ePos, dur) {
			var startTime = t$.timestamp(), diffTime = 0;
			stopScroll = true;
			elem.oInterval = setInterval(function() {
				diffTime = (t$.timestamp() - startTime) / 1000;
				elem.currentPos = elasticEaseOut(diffTime, sPos[0], ePos[0], dur);
				elem.scrollTo(elem.currentPos, 0);
				if(diffTime > dur) {
					clearInterval(elem.oInterval);
					stopScroll = false;
				}

			}, 0);
			startScroll = false;
		}

		elasticEaseOut = function(t, b, c, d, a, p) {
			if(t == 0)
				return b;
			if((t /= d) == 1)
				return b + c;
			if(!p)
				p = d * .3;
			if(!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		};
		Ti.API.debug('######### ROUNDED SCROLL' + roundTo(scrollX, t$.screenW()));
		doPosChangeMem(self.container, [startScroll, 0], [scrollX, 0], 1);
		touchStart = 0;
		Ti.API.debug("### TE: TYPE: " + e.type);
		Ti.API.debug("### TE: X: " + e.x + " Y: " + e.y);
	};

	self.container.addEventListener('scroll', scrolllistener);
	self.container.addEventListener('touchstart', function(e) {
		touchStart = scrollX;
		// Hack pass focus event to form fields
		if (typeof e.source.focus === 'function') e.source.focus();
	});
	self.container.addEventListener('touchend', endscroll);
	//self.container.addEventListener('touchcancel', endscroll);
	for(var i = 0, l = this.views.length; i < l; i++) {
		this.addTab(this.views[i]);
		//this.addView(this.views[i]);
	}
	this.root.add(this.container);
};

exports.StripView.prototype = {
	init : function(args) {
	},
	select : function(i) {
		if(i === parseInt(i)) {
			// Select By index
			this.setActive(i);
		} else {
			// Select By id
			for(var i in this.tabs) {
				if(this.tabs[i].id && this.tabs[i].id == i) {
					this.setActive(i);
				}
			}
		}
	},
	setActive : function(i) {
		// previous last tabs
		this.last_tab = this.current_tab;
		this.current_tab = i;

		this.tabs[i].backGroundColor = '#eee';
		this.tabs[i].color = '#999';
		this.container.animate({
			duration : 1000,
			left : t$.screenW() * i * -1
		});
	},
	addView : function(v, i) {
		i = i || this.container.length + 1;
		var newView = Ti.UI.createView({
			id : v.id,
			top : 0,
			bottom : 0,
			left : t$.screenW() * i,
			width : t$.screenW()
		});
		newView.add(v);
		this.container.width += t$.screenW();
		this.container.add(newView);
	},
	addTab : function(v, i) {
		var newView = Ti.UI.createView({
			layout : 'vertical',
			id : v.id,
			top : 0,
			bottom : 0,
			left : 0,
			width : t$.screenW()
		});
		newView.add(Ti.UI.createLabel({
			text : v.title,
			top : 0,
			bottom : 0,
			left : 0,
			textAlign : 'center',
			backgroundColor : v.bgcolor || '#333',
			color : v.color || '#eee',
			width : t$.screenW()
		}));
		newView.add(v);

		this.container.add(newView);
	},
	addTo : function(v) {
		var self = this;
		v.add(self.container);
	},
	toObj : function(v) {
		this.container
	}
};

function makeSwipeable(view, allowVertical, tolerance, threshhold) {
	threshhold = threshhold || 30;
	tolerance = tolerance || 2;
	var start;
	view.addEventListener('touchstart', function(evt) {
		start = evt;
	});
	view.addEventListener('touchend', function(end) {
		var dx = end.x - start.x, dy = end.y - start.y;
		var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		// only trigger if dragged further than 50 pixels
		if(dist < threshhold) {
			return;
		}
		var isVertical = Math.abs(dx / dy) < 1 / tolerance;
		var isHorizontal = Math.abs(dy / dx) < 1 / tolerance;
		// only trigger if dragged in a particular direction
		if(!isVertical && !isHorizontal) {
			return;
		}
		// disallow vertical swipe, depending on the setting
		if(!allowVertical && isVertical) {
			return;
		}
		// now fire the event off so regular 'swipe' handlers can use this!
		end.direction = isHorizontal ? ((dx < 0) ? 'left' : 'right') : ((dy < 0) ? 'up' : 'down');
		end.type = 'swipe';
		view.fireEvent('swipe', end);
	});
}

/// class Smooth - simple smooth animation.
function Smooth(target, property, baseDuration, delay, initialRatio) {
	this.target = target;
	this.property = property;
	this.baseDuration = baseDuration || 180;
	this.delay = delay || 16;
	this.initialRatio = initialRatio || 0;
}

Smooth.easings = {
	easeNone : function easeNone(t, b, c, d) {
		return c * t / d + b;
	},
	easeInSine : function easeInSine(t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine : function easeOutSine(t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInExpo : function easeInExpo(t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
	},
	easeOutExpo : function easeOutExpo(t, b, c, d) {
		return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
	}
};
(function(member) {
	member.apply(Smooth.prototype)
})(function() {
	this.easing = Smooth.easings.easeOutExpo;
	this.duration = function(change, sliding) {
		return this.baseDuration;
	};
	this.go = function(/*from, */dest) {
		var target = this.target, prop = this.property, from;
		if(arguments.length > 1) {
			from = arguments[0];
			dest = arguments[1];
		} else {
			from = target[prop];
		}
		if(this.isActive) {
			if(this.dest == dest)
				return;
			this.dest = dest;
			this.activity.slide(dest);
			return;
		}
		var begin = parseFloat(from) || 0, end = parseFloat(dest), change = end - begin;
		if(this.initialRatio)
			begin += change * this.initialRatio;
		var m = /[0-9]*\.?([0-9]*)(.*)/.exec(dest), scale = ( m ? m[1].length : 0), unit = ( m ? m[2] : null);
		var power = Math.pow(10, scale);
		var start = new Date(), duration = this.duration(change, false);
		this.from = from;
		this.dest = dest;
		this.isActive = true;
		this.activity = {
			slide : slide,
			anim : anim,
			dispose : dispose
		};
		var self = this;
		function slide(dest) {
			var cur = parseFloat(self.current());
			if(!isNaN(cur))
				begin = cur;
			end = parseFloat(dest);
			change = end - begin;
			start = new Date();
			duration = self.duration(change, true);
		}

		function anim() {
			var finished = false;
			try {
				var time = new Date() - start, next;
				if(time >= duration) {
					next = self.dest;
					finished = true;
				} else {
					next = (self.easing(time, begin, change, duration) * power + 0.5 | 0) / power;
					// not strict round at negative value.
					if(unit)
						next = next + unit;
					if(next == self.dest)
						finished = true;
				}
				target[prop] = next;
			} catch(e) {
				self.clear();
				throw e;
			}
			if(finished) {
				self.clear();
				if(self.onfinish)
					self.onfinish();
			} else {
				if(self.onprogress)
					self.onprogress();
			}
		}

		var tid = setInterval(anim, this.delay);
		function dispose() {
			if(tid)
				clearInterval(tid);
			tid = null;
		}

		if(arguments.length > 1 || duration <= 0)
			anim();
		// call first if "from" set or "duration" isn't set.
	};
	this.current = function() {
		return this.target[this.property];
	};
	this.clear = function() {
		this.isActive = false;
		if(this.activity != null)
			this.activity.dispose();
		this.activity = null;
	};
	this.restore = function() {
		if(this.from != null)
			this.target[this.property] = this.from;
		this.clear();
	};
});
/*
 var movementHistory = {
 pointAndTimeHistory : [],
 set : function(point) {
 // add this point into the point and time history for velocity calculations based on time & distance
 this.pointAndTimeHistory.push({
 time : new Date().getTime(),
 x : point.x,
 y : point.y
 });

 // trim history older than 300ms ago
 while((this.pointAndTimeHistory.length > 0) && ((this.pointAndTimeHistory[0].time + 300) < (new Date()).getTime() )) {
 this.pointAndTimeHistory.shift();
 }

 // get average horizonal velocity based on oldest co-ordinate and newest co-ordinate
 if(this.pointAndTimeHistory.length) {
 this.xVelocity = (point.x - this.pointAndTimeHistory[0].x) / (new Date() - this.pointAndTimeHistory[0].time);
 if(isNaN(this.xVelocity)) {
 this.xVelocity = 0;
 }// protect against NaN
 this.yVelocity = (point.y - this.pointAndTimeHistory[0].y) / (new Date() - this.pointAndTimeHistory[0].time);
 if(isNaN(this.yVelocity)) {
 this.yVelocity = 0;
 } // protect against NaN
 } else {
 this.xVelocity = 0;
 this.yVelocity = 0;
 }

 // store the current position
 this.x = point.x;
 this.y = point.y;
 }
 };

 view.addEventListener('touchstart', function(e) {
 movementHistory.set(e.globalPoint);
 });

 view.addEventListener('touchmove', function(e) {
 movementHistory.set(e.globalPoint);
 if(Math.abs(movementHistory.xVelocity) > Math.abs(movementHistory.yVelocity)) {
 if(Math.abs(movementHistory.xVelocity) > 1) {
 // horizontal swipe as user has gestured quickly but not lifted their finger
 // if x > 0 then swipe is left to right
 }
 } else {
 if(Math.abs(movementHistory.yVelocity) > 1) {
 // vertical swipe as user has gestured quickly but not lifted their finger
 // if y > 0 then vertically down
 }
 }
 });

 view.addEventListener('touchend', function(e) {
 movementHistory.set(e.globalPoint);
 if(Math.abs(movementHistory.xVelocity) > Math.abs(movementHistory.yVelocity)) {
 if(Math.abs(movementHistory.xVelocity) > 0.25) {
 // horizontal swipe as user has gestured and lifted their finger
 }
 } else {
 if(Math.abs(movementHistory.yVelocity) > 0.25) {
 // vertical swipe as user has gestured and lifted their finger
 }
 }
 });
 */