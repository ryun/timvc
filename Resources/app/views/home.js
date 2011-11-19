exports.home = new t$.BaseView({
	
	view: function(data) {
		data = data || {};
		t$.load.helpers('http', t$);
		
		Titanium.UI.setBackgroundColor('#000');
		
		var tabGroup = Titanium.UI.createTabGroup();
		
		
		// create base UI tab and root window
		//
		var win1 = Titanium.UI.createWindow({ title:'Tab 1', backgroundColor:'#fff',layout:'vertical' });
		win1.add(t$.button({title:'Add'}, function(){alert('clicked ADD');}));
		
		var tab1 = Titanium.UI.createTab({ icon:'KS_nav_views.png', title:'Tab 1', window:win1 });

		t$.load.require('tableScrollableView', 'lib/helpers/', t$.ui);
		t$.load.require('tableScrollable', 'lib/helpers/', t$.ui);
		var tblView = new t$.ui.tableScrollableView();
		
		// Table objects ()
		var tbl = new t$.ui.tableScrollable({table: {rows: t$.m.notes.getTitles()}});

		tbl.addTo(tblView);
		win1.add(tblView.build());
		
		var label1 = Titanium.UI.createLabel({
			color:'#999',text:'I am Window 1',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},textAlign:'center',width:'auto'
		});
		win1.add(label1);
		
		
		//
		// create controls tab and root window
		//
		var win2 = Titanium.UI.createWindow({layout:'vertical', title:'Tab 2', backgroundColor:'#fff' });
		var tab2 = Titanium.UI.createTab({icon:'KS_nav_ui.png',title:'Tab 2',window:win2});
		var label2 = Titanium.UI.createLabel({
			color:'#999', text:'I am Window 2',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},textAlign:'center',width:'auto'
		});
		win2.add(label2);
		var rows = data.cats;
		// Loop through each row
		for (var i in rows) {
			for (var ii in rows[i]) {
				var label2 = Titanium.UI.createLabel({
					color:'#999',
					text: rows[i][ii],
					font:{fontSize:20,fontFamily:'Helvetica Neue'},
					width:'auto'
				});
				win2.add(label2);
			}
		}

		tabGroup.addTab(tab1);  
		tabGroup.addTab(tab2);
		tabGroup.open();
		
		for(var i in t$.m.category_m){
			Ti.API.debug('#################### MODEL: ' + i);
		}
	},
});
