var Config = Klass.extend({

	init: function(cfg) {
		this.config = cfg || {};
	},
	load: function(table, source) {
		this.table = table || 'ti_app_config';
		source = source || 'native'; // DB or json (file)
	}

});