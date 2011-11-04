t$.baseModel = function(opts) {
	opts = opts || {};
	this.table = opts.table || 'myadb';
	this.prikey = opts.prikey || 'id';
	this.columns = opts.columns || {};
	this.objMethods = opts.methods || {};
  
	t$.forEach(this.objMethods, function(method, name) {this[name] = method;}, this);
};

t$.baseModel.prototype = {
	db: function() {
		return t$.app.dbcon;
	},
	create_table: function() {
		var str = 'CREATE TABLE IF NOT EXISTS ' + this.table;
		var flds = [];
		for (var key in this.columns){
			flds.push(key + ' ' + this.columns[key]);
		}
		str += ' (' + flds.join(',') + ');';
		this.query(str);
	},
	query: function(query, params) {
		params = params || [];
		return this.toArray(this.db().execute(query, params));
	},
	find: function(id){
	    Ti.API.debug('#################### TRYING TO FIND SOMETHING...');
	    try {
	    	var rows = this.query('SELECT * from ' + this.table + ' WHERE ' + this.prikey + ' = ?;', id);
	    }
	    catch(exception) {
			Ti.API.error(exception);
			return null;
	    }
	    return rows;
	},
	findAll: function(){
	    try {
	    	var rows = this.query('SELECT * from ' + this.table);
	    }
	    catch(exception) {
			Ti.API.error(exception);
			return null;
	    }
	    return rows;
	},
	toArray: function(rows) {
		var result = [], rowData;
		// Loop through each row
		if (t$.isObject(rows))
		{
			while (rows.isValidRow()) {
				rowData = {};
	
				for (var i=0; i<rows.fieldCount(); i += 1) {
					rowData[rows.fieldName(i)] = rows.field(i);
				}
				result.push(rowData);
				rows.next();
			}
    		rows.close();
    	}
    	return result;
	},
	/*** Query Helpers ***/
	countAll: function() {
		var result = this.query("SELECT COUNT(*) FROM " + this.table);
		if (result === null) return 0;
		if (rows.rowCount === 0) result = 0;
		else result = result.field(0);
		result.close();
	},
	lastInsertId: function() {
		return this.db().lastInsertRowId;
	},
	affectedRows: function() {
		return this.db().rowsAffected;
	}
};


Bookmarks_Model = new t$.baseModel({
	table: 'bookmarks',
	prikey: 'id',
	columns: {
		id: 	'INTEGER PRIMARY KEY AUTOINCREMENT',
		title: 	'TEXT',
		url: 	'TEXT',
	},
	methods:{
		
	},
});

/*
t$.query = function(){
	this._operation = '';
	this._fields = [];
	this._values = [];
	this._tables = [];
	
	this._join = '';
	this._using = '';
		
	this._where = [];
	this._limit = 0;
	this._offset = 0;
	
	this._orderBy = array();
	this._order = 'ASC';
	this._groupBy = array();
	this.select = function(q){
		q = t$.trim(q);
		this.fields.push(q); 
	};
}
*/