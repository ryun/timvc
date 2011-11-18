Ti.include('lib/Core.js');

Ti.include('lib/helpers/ui.js');

// Add alias of global namespace
t$.global = this;

Ti.include('lib/db.js');

t$.load.lib('BaseController', t$);
t$.load.lib('BaseModel', t$);
//Ti.include('lib/BaseModel.js');

Ti.include('lib/BaseView.js');

t$.bootstrap();

// {controller: , action: , params: }
t$.load.Dispatch('home', 'index', '33');

// Manualy load controller (for example)
//t$.load.controller('home');

// Call controller action/method
//t$.c.home.index();

