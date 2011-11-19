exports.tableScrollable = function(cfg) {
	var self = this;
	cfg = cfg || {};
	this.table = cfg.table || {};
	this.table.header = this.table.header || [];
	this.table.rows = this.table.rows || [];
	this._current_row = false;
	

	
	// CONTAINER BG COLOR
	cfg.bgColor = cfg.bgColor || '#000';

	// TABLE CELLS (TD)
	cfg.C_width = cfg.C_width || t$.dp(95);
	cfg.C_height = cfg.C_height || t$.dp(50);
	cfg.C_color = cfg.C_color || '#000';
	cfg.C_font = cfg.C_font || {};

	//cfg.C_bgColor = cfg.C_bgColor || '#fff';
	cfg.C_bgColors = cfg.C_bgColors || ['#fff', '#eee'];

	// TABLE ROWS (TR)
	cfg.R_bgColor = '#fff';

	// PADDING LEFT/RIGHT
	cfg.xPad = cfg.xPad || t$.dp(0);
	// PADDING TOP/BOTTOM
	cfg.yPad = cfg.yPad || t$.dp(0);

	cfg.H_bgColor = cfg.H_bgColor || '#fff';

	// TABLE HEADER CELLS (TH)
	cfg.HC_height = cfg.HC_height || t$.dp(65);
	cfg.HC_width = cfg.HC_width || t$.dp(95);
	cfg.HC_bgColor = cfg.HC_bgColor || '#000';
	cfg.HC_color = cfg.HC_color || '#fff';
	cfg.HC_font = cfg.HC_font || {
		fontWeight : 'bold'
	};

	function _header(data) {
		var v = Ti.UI.createView({
			left: cfg.xPad,
			width : cfg.HC_width,
			height : cfg.HC_height,
			backgroundColor : cfg.HC_bgColor,
		});
		v.add(Ti.UI.createLabel({
			color : cfg.HC_color,
			font : cfg.HC_font,
			text : data
		}));
		return v;
	}

	function _cell(data, bgcolor) {
		var v = Ti.UI.createView({
			left : cfg.xPad,
			width : cfg.C_width,
			height : cfg.C_height,
			backgroundColor : bgcolor
		});
		v.add(Ti.UI.createLabel({
			color : cfg.C_color,
			font : cfg.C_font,
			text : data
		}));
		return v;
	}


	this._view = Ti.UI.createScrollView({
		scrollType : "horizontal",
		backgroundColor : cfg.bgColor
	});

	this.addRow = function(el) {
		this.table.rows.push(el);
	};

	this.addTo = function(v) {
		var tbl_row_count = 0;
		var _tmp_top = 0;

		// Add headers/field names if none are setup
		if(this.table.header.length <= 0) {
			for(var i in this.table.rows[0]) {
				this.addHeader(i);
			}
		}

		/************ HEADER ****************/
		this.current_row = Ti.UI.createView({
			layout : "horizontal",
			focusable : false,
			top : 0,
			width: cfg.C_width * this.table.header.length + cfg.yPad*this.table.header.length,
			//width:'auto',
			height : cfg.HC_height + cfg.yPad,
			backgroundColor:cfg.H_bgColor
		});
		for(var i in this.table.header) {
			this.current_row.add(_header(this.table.header[i]));
		}
		this._view.add(this.current_row);

		/************ BODY ****************/
		Ti.API.debug('########################### STARt BODY ############################');
		for(var i in this.table.rows) {
			_tmp_top = (tbl_row_count > 0) ? (tbl_row_count * cfg.C_height) + cfg.yPad + cfg.HC_height + cfg.yPad : cfg.HC_height + cfg.yPad;
			Ti.API.debug('########################## TOP ############################# : ' + _tmp_top);
			this.current_row = Ti.UI.createView({
				layout : "horizontal",
				focusable : false,
				top : _tmp_top,
				width:cfg.C_width * this.table.header.length + cfg.yPad*this.table.header.length,

				height : cfg.C_height + (2 * cfg.yPad),
				backgroundColor: cfg.R_bgColor
			});

			for(var ii in this.table.rows[i]) {
				if(cfg.C_bgColors.length > 0) {
					var _rowcolor = (tbl_row_count % 2) ? cfg.C_bgColors[0] : cfg.C_bgColors[1];
				} else {
					var _rowcolor = cfg.C_bgColor;
				}
				this.current_row.add(_cell(this.table.rows[i][ii], _rowcolor));
			}
			tbl_row_count++;
			this._view.add(this.current_row);
		}
		v.add(this._view);

	};

	this.addHeader = function(el) {
		if( typeof el == 'Array') {
			this.table.header = el;
		} else {
			this.table.header.push(el);
		}
		//return this;
	};
	return this;
};