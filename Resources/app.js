Ti.include('lib/Core.js');

// Add alias of global namespace
t$.global = this;

Ti.include('lib/db.js');
Ti.include('lib/BaseModel.js');
Ti.include('lib/BaseView.js');

t$.bootstrap();

// Manualy load controller (for example)
t$.load.controller('home');

// Call controller action/method
t$.c.home.index();

