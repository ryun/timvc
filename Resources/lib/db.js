t$.DB = function(opts) {
	opts = opts || {};
	this.dbname = opts.dbname || 'db';
	this.table = opts.table || '';
	this.pk = opts.pk || 'id';
	this.cols = opts.cols || {};
	this.objMethods = opts.methods || {};
	Ti.API.debug('#################### INIT DATABASE');

};

t$.DB.prototype = {
	install: function(name, path) {
		this.dbname = name || this.dbname;
		this.dbpath = path || this.dbname + '.sqlite';
		Ti.API.debug('#################### INSTALLING DATABASE');
		return Titanium.Database.install(this.dbpath, this.dbname);
	},
	open: function(name, path) {
		if (t$.app.dbcon === false) {
			var self=this;
			Ti.App.addEventListener('close',function(e){
				if ( t$.app.dbcon ) {
					self.close();
				}
			});
			Ti.API.debug('#################### OPENING DATABASE');
			this.dbname = name || this.dbname;
			this.dbpath = path || this.dbname + '.db';
			//Titanium.Database.install(this.dbpath, this.dbname);
			
			return Titanium.Database.open(this.dbname);
			//t$.app.dbcon.execute('PRAGMA read_uncommitted=true');
			
		}
		return t$.app.dbcon;
	},
	rowsAffected: function(){
		var n = t$.app.dbcon.rowsAffected;
		return n || 0;
	},
	close: function(){
		t$.app.dbcon.close();
		t$.app.dbcon = false;
		Ti.API.debug('#################### CLOSED DATABASE !!! ALL DONE!!');
	},
};

t$.DbResults = function(result) {
	//if (result === null || result.rowCount === 0) {
	if (!result) {
		return 0;
	}
	this.result = result;
	this.rowcount = result.rowCount;
	this.validrow = result.validRow;
};

t$.DbResults.prototype = {
	fieldCount: function(){
		return this.result.fieldCount();
	},
	isRow: function() {
		return this.result.isValidRow();
	},
	rowCount: function(){
		return this.rowcount;
	},
	
	// close the result set and release resources. once closed, this result set must no longer be used
	close: function(){
		this.result.close();
	},

	// retrieve a row value by field index
	field: function(i) {
		Ti.API.debug('#### GET FIELD: ' + i);
		return (t$.isNumber(i)) ? this.result.field(i) : this.result.fieldByName(i);
	},

	// retrieve a row value by field name
	fieldByName: function(i) {
		return this.result.fieldByName(i);
	},

	// return the number of columns in the result set
	fieldCount: function(){
		return this.result.fieldCount;
	},

	// return the field name for field index
	fieldName: function(i){
		return this.result.fieldName(i);
	},

	// iterate to the next row in the result set. returns false if no more results are available
	next: function(){
		this.result.next();
	},
	toArray: function(){
		var result = [], rowData;
		// Loop through each row
		if (t$.isObject(this.result))
		{
			while (this.isRow()) {
				rowData = {};
	
				for (var i=0; i<this.fieldCount(); i++) {
					rowData[this.fieldName(i)] = this.field(i);
				}
				result.push(rowData);
				this.next();
			}
    		this.close();
    	}
    	return result;
	}
};