exports.home = new t$.BaseView({
	
	view: function(data) {
		Titanium.UI.setBackgroundColor('#000');
		
		var tabGroup = Titanium.UI.createTabGroup();
		
		
		// create base UI tab and root window
		//
		var win1 = Titanium.UI.createWindow({ title:'Tab 1', backgroundColor:'#fff',layout:'vertical' });
		var tab1 = Titanium.UI.createTab({ icon:'KS_nav_views.png', title:'Tab 1', window:win1 });

		var tblView = new t$.ui.tableScrollableView();
		
		// Table objects ()
		var tbl = new t$.ui.tableScrollable();
		var tbl2 = new t$.ui.tableScrollable();
		
		for (var i=0; i<5; i++){
			tbl.addRow({id : i,cat : 'News' + i,title : 'Test Title 0' + i,cost : 3 * i});
		}
		for (var i=0; i<5; i++){
			tbl2.addRow({id : i,cat : 'News' + i,title : 'Test Title 0' + i,cost : 2 * i});
		}
		tbl2.addRow({
			id : 11,
			cat : 'Test Cat',
			title : 'Title Stuff',
			cost : 21
		});
		
		//tbl.tr({id:5, cat: 'News', title: 'Test Title 01', cost: 50 });
		tbl.addTo(tblView);
		tbl2.addTo(tblView);
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
		var rows = data;
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
	},
});
