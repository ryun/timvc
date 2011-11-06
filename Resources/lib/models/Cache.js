exports.Cache = new t$.baseModel({
	table: 'tbl_app_cache',
	prikey: 'key',
	columns: {
		key: 'TEXT UNIQUE',
		val: 'TEXT',
		expiration: 'INTEGER'
	},
	methods:{
		init: function() {	
			this.expire_interval = this.expire_interval || 60;
			this.expire_default = this.expire_default || 300;
			
			// or get
			this.expire_on = this.expire_on || 'intervals';
			this.init_cache();
		},
		
		// Cache initialization
		init_cache: function() {
			this.query('CREATE TABLE IF NOT EXISTS ' + this.table + ' (key TEXT UNIQUE, val TEXT, expiration INTEGER)');
			Ti.API.info('[CACHE] INITIALIZED');
			
			if (this.expire_on == 'intervals') {
				var self = this; 
				setInterval(self.expire_cache, self.expire_interval * 1000);
			}
		},
	
		expire_cache: function() {
			// deletes everything older than timestamp
			this.query('DELETE FROM ' + this.table + ' WHERE expiration <= ?', this.timestamp());
	
		},
	
		timestamp: function() {
			var value = Math.floor(new Date().getTime() / 1000);
			return value;
		},
	
		get: function(key) {
		
			if (this.expire_on == 'get') {
				this.query('DELETE FROM ' + this.table + ' WHERE expiration <= ?', this.timestamp());
			}
	
			var rs = this.query_result('SELECT val FROM ' + this.table + ' WHERE key = ?', key);
			var result = null;
			if (rs.isRow()) {
				Ti.API.info('[CACHE] YEP, key[' + key + ']');
				result = JSON.parse(rs.field('val'));
			} else {
				Ti.API.info('[CACHE] NOPE, key[' + key + ']');
			}
			rs.close();
	
			return result;
		},
	
		put: function(key, val, expiration_seconds) {
			
			expiration_seconds = expiration_seconds || this.expire_default;
			
			var expires_in = this.timestamp() + expiration_seconds;
			//if (!t$.isString(val)) val = JSON.stringify(val);
			val = JSON.stringify(val);
			var qstr = 'INSERT OR REPLACE INTO ' + this.table + ' (key, val, expiration) VALUES (?, ?, ?);';
			this.query(qstr, key, val, expires_in);
		},
	
		del: function(key) {
			this.query('DELETE FROM ' + this.table + ' WHERE key = ?', key);
			Ti.API.info('[CACHE] DELETED key[' + key + ']');
		}
	}
});