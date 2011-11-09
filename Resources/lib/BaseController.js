exports.BaseController = function(opts) {
	opts = opts || {};
	this.controller = opts.controller || 'home';
	this.data = opts.data || {};  
	this.objMethods = opts.methods || {};
	t$.forEach(this.objMethods, function(method, name) {this[name] = method;}, this);
};

exports.BaseController.prototype = {
	action404: function(data){
		t$.load.view('error');
		t$.v.error.render(data);
	},
	hasAction: function(funk){
		return t$.contains(t$.c[this.controller],funk);
	}
};