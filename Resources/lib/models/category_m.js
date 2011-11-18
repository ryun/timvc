exports.category_m = new t$.BaseModel({
	table: 'category',
	prikey: 'id',
	columns: {
		id:'INTEGER PRIMARY KEY AUTOINCREMENT' 
		/*{
			sql: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			validation:[],
			mask:[],
		}*/
		,
		name:'TEXT',
	},
	methods: {
		getOne: function(id) {
			return this.find(id).toArray();
		}
	},
});
