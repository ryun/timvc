exports.DB = function(opts) {
	opts = opts || {};
	this.dbname = opts.dbname || 'db';
	this.table = opts.table || '';
	this.pk = opts.pk || 'id';
	this.cols = opts.cols || {};
	this.objMethods = opts.methods || {};
	Ti.API.debug('#################### INIT DATABASE');

};

exports.DB.prototype = {
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

