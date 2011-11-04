exports.home = {
	__construct: function(){

	},
	index : function(id) {
		//t$.load.lib('category_m');
		t$.load.model('category_m');
		var data = [{id:1,name:'cat1'}];
		t$.db.close();
		t$.load.view('home');
		t$.v.home.render(data);
	}
};
