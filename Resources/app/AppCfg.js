/**
 * Main Application Config
 * @author ryun
 */

Ti.include('../sys/Core.js');
t$.cfg = {
	res_path: Titanium.Filesystem.resourcesDirectory,
	sys_path: "sys/",
	app_path: "app/",
	asset_path: "assets/",
	img_path: "assets/images/",
	thm_path: "assets/styles/",
	tmpl_path: "assets/templates/",
	db_path: "assets/db/",
	autoload: {
		system:[
			'core/db',
			'BaseController',
			'BaseModel',
			'BaseView',
		],
		app:[
			'controllers/home'
		],
	}
};
