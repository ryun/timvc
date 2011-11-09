
Ti.include('lib/Core.js');
Ti.include('lib/helpers/ui.js');

// Add alias of global namespace
t$.global = this;

Ti.include('lib/db.js');
t$.load.lib('BaseController', t$);
t$.load.lib('baseModel', t$);

//Ti.include('lib/BaseModel.js');
Ti.include('lib/BaseView.js');

t$.bootstrap();

// {controller: , action: , params: }
function Dispatch(controller, action, params) {
	// Manualy load controller (for example)
	t$.load.controller(controller);
	// Call controller action/method
	var _c = t$.c[controller];
	if (_c.hasAction(action)){
		t$.c[controller][action](params);
	} else {
		var alrt = t$.alertDialog({
			title:'Action Not Found',
			message:'Action "' + action + '" not found in [' + controller + ']',
		});
	}
}
Dispatch('home', 'index', '33');

// Manualy load controller (for example)
//t$.load.controller('home');

// Call controller action/method
//t$.c.home.index();

