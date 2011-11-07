/**
* Create a new model.
* @class	This class is used as the base model class.
*/

exports.baseModel = function(opts, args) {
	opts = opts || {};
	this.args = args || null;
	this.table = opts.table || 'myadb';
	this.prikey = opts.prikey || 'id';
	this.columns = opts.columns || {};
	this.objMethods = opts.methods || {};
	
	// Add Custom model Methods
	t$.forEach(this.objMethods, function(method, name) {this[name] = method;}, this);

	
	if ( typeof this.init == "function" ) {
		this.init();
	}

};

exports.baseModel.prototype = {
	/*
	 * @alias	t$.app.dbcon
	 * returns	t$.app.dbcon
	 */
	db: function() {
		return t$.app.dbcon;
	},
	
	/**
	* Creates "if not exists" the database table for this model
	*
	* @return	{Void}
	* @type		{function}
	*/
	create_table: function() {
		var str = 'CREATE TABLE IF NOT EXISTS ' + this.table;
		var flds = [];
		for (var key in this.columns){
			flds.push(key + ' ' + this.columns[key]);
		}
		str += ' (' + flds.join(',') + ');';
		this.query(str);
	},
	
	/**
	* Query a database
	*
	* @type		{function}
	* @param	{String} query A valid SQL statement
	* @param	{String, Array}	[params]
	* @return	{Void}
	*/
	query: function(query, params) {
		params = params || [];
		Ti.API.debug('#################### TRYING QUERY: ' + query);
		return this.db().execute(query, params);
	},
	query_result: function(query, params) {
		params = params || [];
		Ti.API.debug('#################### TRYING QUERY: ' + query);
		return new t$.DbResults(this.db().execute(query, params));
	},
	
	/**
	 * Find a record with a specified primarykey
	 * 
	 * @type	{function}
	 * @param	{INT}	id	The primary id of the record (usualy the ID)
	 * @return	{Object}	Dictionary object of rows and records.
	 */
	find: function(id){
	    Ti.API.debug('#################### TRYING TO FIND SOMETHING...');
	    try {
	    	v = (t$.isString(id)) ? "\'?\'" : "?";
	    	var rows = this.query_result('SELECT * from ' + this.table + ' WHERE ' + this.prikey + ' = ' + v + ';', id);
	    }
	    catch(exception) {
			Ti.API.error(exception);
			return null;
	    }
	    return rows;
	},
	findAll: function(){
	    try {
	    	Ti.API.debug('#################### TRYING TO FIND SOMETHING...');
	    	var rows = this.query_result('SELECT * FROM ' + this.table);
	    }
	    catch(exception) {
			Ti.API.error(exception);
			return null;
	    }
	    return rows;
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

/*
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