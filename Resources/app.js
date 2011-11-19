
Ti.include('app/AppCfg.js');

t$.inc.helpers('ui');
// Add alias of global namespace


t$.load.core('DB');
t$.load.core('DbResults');

t$.load.core('BaseController', t$);
t$.load.core('BaseModel', t$);
t$.load.core('BaseView', t$);

t$.bootstrap();

// {controller: , action: , params: }
t$.load.Dispatch('home', 'index', '33');

// Manualy load controller (for example)
//t$.load.controller('home');

// Call controller action/method
//t$.c.home.index();

