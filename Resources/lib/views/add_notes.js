exports.add_notes = new t$.BaseView({

	view : function(data) {
		data = data || {};

		t$.load.model('notes_m');
		
		t$.load.helpers('FormBuilder', t$);
		
		var frm = new t$.FormBuilder('add_notes', {layout:'vertical',title:'Form View',backgroundColor: '#eee'});
		
		var fields = {};

		frm.create('Label', 'ltitle', {
			text : 'Title',
		});

		frm.create('TextField', 'title', {
			color : '#336699',
			hintText : 'Focus to see keyboard w/ toolbar',
			width : '98%'
		}).addEventListener('blur', function(e){
			//Ti.API.debug('########## KEY: ' + fields.title.getParent().title + ' - VAL: ' + e.source.left);
			for (var i in e) {
				Ti.API.debug('KEY: ' + i + ' - VAL: ' + e[i]);
			}
		});
		frm.create('Label', 'lnotes',{
			text:'Note'
		});

		var picker = frm.create('Picker','cpicker',{
				selectionIndicator:true,
				data: [{title:'Bananas'},{title:'Strawberries'}, {title:'Mangos'},{title:'Grapes'}]
			}).addEventListener('change', function(e){
			//Ti.API.debug('########## KEY: ' + fields.title.getParent().title + ' - VAL: ' + e.source.left);
			for (var i in e) {
				Ti.API.debug('KEY: ' + i + ' - VAL: ' + e[i]);
			}
		});

		frm.create('Label', 'lnotes',{
			text:'Note'
		});

		frm.create('TextArea', 'note', {
			color : '#336699',
			value : '',
			height : 100,
			width : '98%',
			top : 10,
		});

		frm.create('Button', 'submit', {
			title : 'Add' 
		}).addEventListener('click', function(e){
			Ti.API.debug(frm.getData());
			var ok = t$.m.notes_m.insert(frm.getData());
			if(ok) { alert('Note Saved');}
		});
		
		
		var win = Titanium.UI.createWindow({
			title : 'Add Note',
			backgroundColor : '#fff'
		});
		t$.load.require('tableScrollableView', 'lib/helpers/', t$.ui);
		t$.load.require('tableScrollable', 'lib/helpers/', t$.ui);
		var tblView = new t$.ui.tableScrollableView({title:'Notes View'});
		
		// Table objects ()
		var note_titles = t$.m.notes_m.getTitles();
		Ti.API.debug('NOTES: ' + JSON.stringify(note_titles));
		var tbl = new t$.ui.tableScrollable({table: {rows: note_titles}});

		tbl.addTo(tblView);
		

		//var formView = Ti.UI.createView({layout:'vertical',title:'Form View',backgroundColor: '#eee'});
		//frm.addTo(win);
		//t$.ui.addToView(formView, [title_label, fields.title, note_label, fields.note, add_button]);
		var tblView = tblView.build();
		t$.load.helpers('StripView', t$.ui);
		var tabViews = [
			frm.formView,
			tblView,
			Ti.UI.createView({title:'TABS 3',backgroundColor: '#555'}),
		];
		var tabScroll = new t$.ui.StripView({
			views: tabViews
		});
		var win = Titanium.UI.createWindow({
			title : 'Add Note',
			backgroundColor : '#fff'
		});
		

		
		tabScroll.addTo(win);
		t$.nav.open(win);

		/*var form = {
		 title:{
		 db:true,
		 label: t$.label({text:'Title'}),
		 field: t$.input({
		 color:'#336699',
		 value:'Focus to see keyboard w/ toolbar',
		 height:35, width:300, top:10,
		 })
		 },
		 note: {
		 db:true,
		 label: t$.label({text:'Note'}),
		 field: t$.textarea({
		 color:'#336699',
		 value:'Focus to see keyboard w/ toolbar',
		 height:35,
		 width:300,
		 top:10,
		 })
		 },
		 add:{
		 button: t$.button({title:'Add'})
		 },
		 };
		 t$.addForm(form, Titanium.UI.getCurrentWindow());
		 */
	},
});
