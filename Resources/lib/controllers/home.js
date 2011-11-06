exports.home = {
	__construct: function(){

	},
	index : function(id) {
		t$.load.require('tableScrollableView', 'lib/helpers/', t$.ui);
		t$.load.require('tableScrollable', 'lib/helpers/', t$.ui);
		t$.load.model('category_m');
		
		/*t$.m.category_m.create_table();
		t$.m.category_m.query("INSERT INTO category VALUES(1,'Category 01');");
		t$.m.category_m.query("INSERT INTO category VALUES(2,'Category 02');");
		t$.m.category_m.query("INSERT INTO category VALUES(3,'Category 03');");*/
		
		t$.load.model('Cache');
		
		var data = t$.m.category_m.findAll();
		if (data != 0) data = data.toArray();
		else data = [{id:1,name:'cat1'}];
		
		t$.m.Cache.put('TestCache', {test:'Hello World!!'});
		
		var tCache = t$.m.Cache.get('TestCache');
		//alert(tCache);
		alert(tCache.test);
		
		t$.app.dbcon.close();
		
		t$.load.view('home');
		t$.v.home.render(data);
	}
};
