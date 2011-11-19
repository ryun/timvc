exports.Cache = new t$.BaseModel({
	table: 'tbl_app_cache',
	prikey: 'key',
	columns: {
		key: 'TEXT PRIMARY KEY',
		val: 'TEXT',
		expiration: 'INTEGER'
	},
	methods:{
		init: function() {	
			this.expire_interval = this.expire_interval || 60;
			this.expire_default = this.expire_default || 300;

			// Expire Option [ intervals | get ]
			this.expire_on = this.expire_on || 'get';
			this.init_cache();
		},
		
		// Cache initialization
		init_cache: function() {
			this.query('CREATE TABLE IF NOT EXISTS ' + this.table + ' (key TEXT PRIMARY KEY, val TEXT, expiration INTEGER);');
			Ti.API.info('[CACHE] INITIALIZED');
			
			if (this.expire_on == 'intervals') {
				var self = this;
				var expire_cache = function() {
					self.query('DELETE FROM ' + self.table + ' WHERE expiration <= ?', self.timestamp());
				}
				
				setInterval(expire_cache, self.expire_interval * 1000);
			}
		},

		clear_cache: function() {
			// deletes everything
			this.query('DELETE FROM ' + this.table);
		},
	
	
		timestamp: function() {
			var value = Math.floor(new Date().getTime() / 1000);
			return value;
		},
	
		get: function(key) {
		
			if (this.expire_on == 'get') {
				this.query('DELETE FROM ' + this.table + ' WHERE expiration <= ?', this.timestamp());
			}
			var rs = this.query('SELECT val FROM ' + this.table + ' WHERE key = ?', key);
			var result = null;
			if (rs.isValidRow()) {
				Ti.API.info('[CACHE] YEP, key[' + key + ']' + rs.field(0));
				//result = JSON.parse(rs.field(0));
				result = rs.field(0);
			} else {
				Ti.API.info('[CACHE] NOPE, key[' + key + ']');
			}
			rs.close();
	
			return result;
		},
	
		put: function(key, val, expiration_seconds) {
			
			expiration_seconds = expiration_seconds || this.expire_default;
			
			var expires_in = this.timestamp() + expiration_seconds;

			var qstr = 'REPLACE INTO ' + this.table + ' (key, val, expiration) VALUES (?, ?, ?);';
			this.query(qstr, [key, JSON.stringify(val), expires_in]);
			return t$.db.rowsAffected();
		},
	
		del: function(key) {
			this.query('DELETE FROM ' + this.table + ' WHERE key = ?', key);
			Ti.API.info('[CACHE] DELETED key[' + key + ']');
		}
	}
});