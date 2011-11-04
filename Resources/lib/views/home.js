exports.home = new t$.BaseView({
	
	view: function(data) {
		Titanium.UI.setBackgroundColor('#000');
		
		var tabGroup = Titanium.UI.createTabGroup();
		
		
		// create base UI tab and root window
		//
		var win1 = Titanium.UI.createWindow({ title:'Tab 1', backgroundColor:'#fff' });
		var tab1 = Titanium.UI.createTab({ icon:'KS_nav_views.png', title:'Tab 1', window:win1 });
		
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
