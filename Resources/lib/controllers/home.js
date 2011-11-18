exports.home = new t$.BaseController({
	
	controller: 'home',
	__construct: function(){

	},
	methods: {
		index : function(id) {

			t$.load.model('category_m');
			t$.load.model('notes_m');
			
			t$.load.model('Cache');
			//t$.m.Cache.clear_cache();
			var data = {};
			
			data.titles = t$.m.notes_m.getTitles();
			
			data.cats = t$.m.category_m.findAll();

			if (data.cats != 0) data.cats = data.cats.toArray();
			
			else data.cats = [{id:1,name:'cat1'}];
					
			t$.m.Cache.put('who', {hello:'CoolBeans'});
			t$.m.Cache.put('who', {hello:'Cool for school'});
			
			var tCache = t$.m.Cache.get('who');
			if (tCache.hello) alert(tCache.hello);
			//t$.app.dbcon.close();
			t$.load.view('add_notes');
			t$.v.add_notes.render(data);
			alert('ID: ' + id);
		}
	}
});
