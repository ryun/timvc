Ti.include('lib/Core.js');
t$.global = this;
Ti.include('lib/db.js');
Ti.include('lib/BaseModel.js');
Ti.include('lib/BaseView.js');
t$.bootstrap();
t$.load.controller('home');
t$.c.home.index();