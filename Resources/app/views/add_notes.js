exports.add_notes = new t$.BaseView({

	view : function(data) {
		data = data || {};

		//t$.load.model('notes_m');
		
		t$.load.lib('FormBuilder', t$);
		t$.load.mod('StripView', t$.ui);
		t$.load.mod('tableScrollableView', t$.ui);
		t$.load.mod('tableScrollable', t$.ui);
		
		var frm = new t$.FormBuilder('add_notes', {layout:'vertical',title:'Form View',backgroundColor: '#eee'});

		frm.create('Label', 'ltitle', {	text : 'Title'	});

		frm.create('TextField', 'title', {
			color : '#336699',
			hintText : 'Focus to see keyboard w/ toolbar',
			rules: 'required|alpha',
			//mask: 'phone',
			width : '98%'
		});
		
		frm.create('Label', 'lcats',{
			text:'Category'
		});

		frm.create('Picker','cpicker',{
			selectionIndicator:true,
			data: [{title:'Bananas'},{title:'Strawberries'}, {title:'Mangos'},{title:'Grapes'}],
			rules: 'required',
			className: 'frm-fld',
			events: [{type:'change', callback: function(e){ /* code goes here */ }}]
		});

		frm.create('Label', 'lnotes',{
			text:'Note'
		});

		frm.create('TextArea', 'note', {
			rules: 'required|alpha',
			color:'#c00000'
		});

		var submitBtn = frm.create('Button', 'submit', {
			title : 'Add',
		});
		
		t$.addAction(submitBtn, 'click', 'home/add_note', frm);
		
		// Create Window
		var win = t$.ui.create('Window', 'win-add-notes', {
			title : 'Add Note',
			backgroundColor : '#fff'
		});
		

		var tblView = new t$.ui.tableScrollableView({title:'Notes View'});
		
		// Table objects ()

		var tbl = new t$.ui.tableScrollable({table: {rows: data.titles}});

		tbl.addTo(tblView);
		
		var tblView = tblView.build();
		
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
	},
});
