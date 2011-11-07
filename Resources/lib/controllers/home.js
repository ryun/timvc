exports.home = {
	__construct: function(){

	},
	index : function(id) {
		t$.load.require('tableScrollableView', 'lib/helpers/', t$.ui);
		t$.load.require('tableScrollable', 'lib/helpers/', t$.ui);
		t$.load.model('category_m');
		
		t$.load.model('Cache');
		
		var data = t$.m.category_m.findAll();
		if (data != 0) data = data.toArray();
		else data = [{id:1,name:'cat1'}];
				
		t$.m.Cache.put('who', {hello:'CoolBeans'});
		t$.m.Cache.put('who', {hello:'Cool for school'});
		
		var tCache = t$.m.Cache.get('who');
		alert(tCache.hello);
		//t$.app.dbcon.close();
		
		t$.load.view('home');
		t$.v.home.render(data);
	}
};
