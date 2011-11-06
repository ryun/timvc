TApp.slideUpView = function(win, items) {

	var _win = win || false;
	var _isVisible = false;
	var _isWinAdded = false;
	var _items = items || [];

	var _view = Titanium.UI.createView({
		width:'auto',
		backgroundColor:'#333',
		color:'white',
		bottom:-240,
		height:240,
		zIndex:33
	});
 	
	this.add = function(key, obj) {
		_items.push({k:key, o:obj});
		_view.add(obj);
	};

	this.remove = function(key) {
		var len = _items.length
		for (i=0; i<len;i++)
		{
			if (_items[i].k == key) _items.splice(i, 1);
		}
	};
	
	this.init = function(win, obj){
		if(obj instanceof Array) {
		    var arLen=obj.length;
		    for ( var i=0; i<arLen; ++i ) {
		    	this.add(obj[i].k, obj[i].o);
		    }
		} else {
		    this.add(obj.k, obj.o);
		}
		if (_items.length > 0) {
			_win.add(_view);
			_isWinAdded = true;
		}
	};
	this.isVisible = function(){return _isVisible; };
	this.show = function(){
		if (_items.length > 0) {
			_win.add(_view);
			_isWinAdded = true;
		}
		_view.animate(Titanium.UI.createAnimation({bottom:0, duration:500}));
		_isVisible = true;
	};
	this.hide = function(){
		_view.animate(Titanium.UI.createAnimation({bottom:-240, duration:500}));
		_isVisible = false;
	};
	this.toggle = function(){
		if (_isVisible) {this.hide();}
		else {this.show();}
	};
	if (items) this.init(win, items);
	return this;
};

