exports.tableScrollableView = function(cfg) {
	this.tables = [];
	
	cfg = cfg || {};
	this.height = cfg.height || '200dp';
	var _main = Ti.UI.createView({
		layout : 'vertical',
		height: 'auto'
	});
	var _sc = Ti.UI.createScrollView({
		scrollType : "vertical",
		height: this.height
	});

	this.add = function(t) {
		_main.add(t);
	};

	this.get = function() {
		return _sc;
	};

	this.build = function(v) {
		_sc.add(_main);
		return _sc;
	};
};

exports.tableScrollableView.prototype = {
	add : function(t) {
		this._main.add(t);
	},
	get : function() {
		return this._sc;
	},
	build : function(v) {
		this._sc.add(this._main);
		return this._sc;
	},
};

