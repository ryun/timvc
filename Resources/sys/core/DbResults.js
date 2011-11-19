/**
 * @author ryun
 */
exports.DbResults = function(result) {
	//if (result === null || result.rowCount === 0) {
	if (!result) {
		return 0;
	}
	this.result = result;
	this.rowcount = result.rowCount;
	this.validrow = result.validRow;
};
/*
 * Database Result Set
 */
exports.DbResults.prototype = {
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
