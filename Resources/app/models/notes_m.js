exports.notes_m = new t$.BaseModel({
	table: 'notes',
	prikey: 'id',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		title:'TEXT',
		note: 'TEXT',
	},
	methods: {
		init: function() {
			this.create_table();	
		},


		getTitles: function() {
			var rs = this.query_result("SELECT id, title FROM notes").toArray();
			return rs || [];
		}
	},
});
