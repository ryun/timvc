t$.ui.truncate = function(txt, maxlen, suffix) {
	maxlen = maxlen || 35;
	suffix = suffix || '...';
	if(txt && txt.length > maxlen)
		return txt.substr(0, maxlen) + suffix;
	return txt;
};

t$.ui.addToView = function(view, element) {
	if(t$.isArray(element)) {
		for(var i in element) {
			view.add(element[i]);
		}
	} else {
		view.add(element);
	}
};
t$.ui.addForm = function(form) {
	if (t$.isObject(form)) {
		for(var fld in form) {
			
			// Add Label
			if (form[fld].label){
				view.add(form[fld].label);
			}
			// Add Field
			if (form[fld].field){
				if (form[fld].db){}
				view.add(form[fld].field);
			}
			
			
			view.add(element[i]);
		}
	}
};
t$.ui.isInput = function(type){
	return (/^Picker|ScrollView|SearchBar|Slider|Switch|TextArea|TextField$/.test(type));	
};

t$.ui.view = function(args) {
	return Ti.UI.createView(args);
};

t$.ui.label = function(args) {
	return Ti.UI.createLabel(args);
};
t$.ui.text = function(type, txt, args) {
	var defaults = {
		text : txt,
		width : 'auto',
		color : t$.ui.thm_styles['default'].color,
		font : t$.ui.thm_styles['default'].font
	};
	args = t$.ui.merge(args, defaults);
	if( type in t$.ui.thm_styles) {
		args = t$.ui.merge(args, t$.ui.thm_styles[type]);
	}

	return Ti.UI.createLabel(args);
}

t$.ui.image = function(args) {
	return Ti.UI.createImageView(args);
};

t$.ui.window = function(args) {
	return Ti.UI.createWindow(args);
};
t$.ui.table = function(args) {
	return Ti.UI.createTableView(args);
};

t$.ui.table_row = function(args) {
	return Ti.UI.createTableViewRow(args);
};

t$.ui.createMarker = function(args) {
	return Ti.Map.createAnnotation(args);
};

t$.ui.input = function(args) {
	var txt = Ti.UI.createTextField(args);
	//txt.addEventListener('click', onclick);
	return txt;
};

t$.ui.textarea = function(args) {
	var textfield = Titanium.UI.createTextArea(args);
	return textfield;
};

t$.ui.button = function(args, onclick) {
	var btn = Ti.UI.createButton(args);
	if(onclick)
		btn.addEventListener('click', onclick);
	return btn;
};

t$.ui.picker = function(opts, items) {
	var iLen = items.length;
	if(iLen > 0) {
		opts = opts || {};
		var picker = Titanium.UI.createPicker(opts);
		var _data = [];
		for(var i = 0; i < iLen; i++) {
			_data.push(Titanium.UI.createPickerRow(items[i]));
		}
		picker.add(_data);
		return picker;
	}
	return false;
};

t$.alertDialog = function(opts) {
	opts = opts || {};

	this.title = opts.title || 'Alert';
	this.message = opts.message || '';
	this.buttons = opts.buttons || ['OK'];
	this.cancel = opts.cancel || 0;
	this.autoshow = opts.show || true;

	var alertDialog = Titanium.UI.createAlertDialog({
		title : this.title,
		message : this.message,
		buttonNames : this.buttons,
		cancel : this.cancel
	});
	this.show = function() {
		alertDialog.show();
	};
	this.hide = function() {
		alertDialog.hide();
	};
	this.getObject = function() {
		return alertDialog;
	};
	if(this.autoshow)
		this.show();
}
t$.ui.busy = function() {
};

t$.ui.busy.prototype = {

	show : function showIndicator(msg) {
		msg = msg || 'Loading';
		if(!t$.isAndroid) {
			// window container
			this.winInd = Titanium.UI.createWindow({
				height : 150,
				width : 150
			});

			// black view
			var indView = Titanium.UI.createView({
				height : 150,
				width : 150,
				backgroundColor : '#000',
				borderRadius : 10,
				opacity : 0.8
			});
			this.winInd.add(indView);
			this.myInd = Titanium.UI.createActivityIndicator({
				style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
				height : 30,
				width : 30
			});
			this.message = Titanium.UI.createLabel({
				text : msg,
				color : '#fff',
				width : 'auto',
				height : 'auto',
				font : {
					fontSize : 20,
					fontWeight : 'bold'
				},
				bottom : 20
			});
			this.winInd.add(this.message);
			this.winInd.open();
		} else {
			this.myInd = Titanium.UI.createActivityIndicator({
				height : 30,
				width : 30
			});
			this.myInd.message = msg;
		}
		this.myInd.show();
	},
	update : function(msg) {
		if(!t$.isAndroid)
			this.message.text = msg;
		else
			this.myInd.message = msg;
	},
	hide : function() {
		this.myInd.hide();
		if(!t$.isAndroid) {
			this.winInd.close({
				opacity : 0,
				duration : 500
			});
		}
	}
};
