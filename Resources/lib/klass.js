var makeClass = function(methods) {
	"use strict";
	var fn = function(args) {
		args = args || {};
		if(!(this instanceof arguments.callee ))
			return new arguments.callee(arguments);
		if( typeof this.init == "function")
			this.init.apply(this, args.callee ? args : arguments);
	};
	fn.prototype = methods;
	return fn;
};
/*
function makeClass(){
  return function(args){
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
        this.init.apply( this, args.callee ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };
}*/