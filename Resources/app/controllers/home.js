exports.home = new t$.BaseController({
	
	controller: 'home',
	__construct: function(){

	},
	methods: {
		index : function(id) {

			t$.load.model('category_m');
			t$.load.model('notes_m');
			
			t$.load.lib('Cache');
			
			// Generic object for collecting data to pass on to the view 
			var data = {};
			
			data.titles = t$.m.notes_m.getTitles();
			
			data.cats = t$.m.category_m.findAll();

			if (data.cats != 0) data.cats = data.cats.toArray();
			
			else data.cats = [{id:1,name:'cat1'}];
					
			t$.Cache.put('who', {hello:'CoolBeans'});
			t$.Cache.put('who', {hello:'Cool for school'});
			
			var tCache = t$.Cache.get('who');
			if (tCache.hello) alert(tCache.hello);
			//t$.app.dbcon.close();
			t$.load.view('add_notes');
			t$.v.add_notes.render(data);

		},
		add_note: function(frm) {
			frm._validateForm();
			//form is no Valid
			if (frm.errors.length){
				for(var i in frm.errors){
					Ti.API.debug('### Form ERRORS:' + frm.errors[i]);
				}
			} else {
				var ok = t$.m.notes_m.insert(frm.getData());
				if(ok) {
					alert('Note Saved');
					data.titles = t$.m.notes_m.getTitles();
				}
			}
		},
	}
});
