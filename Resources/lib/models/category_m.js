exports.category_m = new t$.baseModel({
	table: 'category',
	prikey: 'id',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		name:'TEXT',
	},
	methods:{
		getOne: function(id) {

			return this.find(id);
		}
	},
});
