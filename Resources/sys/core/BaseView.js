exports.BaseView = function(opts) {
	opts = opts || {};
	this.view = opts.view || null;
	this.data = opts.data || {};  
	this.objMethods = opts.methods || {};
	t$.forEach(this.objMethods, function(method, name) {this[name] = method;}, this);
};

exports.BaseView.prototype = {
	set: function(key, val){
		this.data[key] = val; 
	},
	get: function(key){
		return this.data[key];
	},
	render: function(data){
		if (this.view !== null){
			this.view(data);
		}
	},
	load: function(){},
	load_partial: function(){
		// Load or Require?
	}
};