exports.home = {
	__construct: function(){

	},
	index : function(id) {
		t$.load.require('tableScrollableView', 'lib/helpers/', t$.ui);
		t$.load.require('tableScrollable', 'lib/helpers/', t$.ui);
		var data = [{id:1,name:'cat1'}];
		
		t$.load.view('home');
		t$.v.home.render(data);
	}
};
