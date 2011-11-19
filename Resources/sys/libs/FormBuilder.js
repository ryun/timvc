exports.FormBuilder = function(formid, o) {
	this.elements = {};
	this.opts = o || {};
	this.fields = [];
	this.callback = o.callback ||
	function(e) {
	};


	this.errors = [];
	this.messages = {};
	this.handlers = {};

	var dopts = {
		db : 'dbname',
		table : 'dbtable',
		// OR
		classModel : 'Cats',
		classAuto : true, // Bool
		layout : 'vertical', // Global layout
	}
	this.opts = t$.defaults(this.opts, dopts);
	this.formView = this.opts.formView || t$.ui.view(this.opts);
	// Create Form container View
};
exports.FormBuilder.prototype = {
	create : function(type, id, o) {
		var t = {}; 
		o = o || {};
		if(t$.inArray(type, t$.ui.types)) {
			//Check for element styles
			if(t$.theme[type]) {
				t$.extend(t, t$.theme[type]);
			}

			// Check for class styles
			if(o.className && t$.hasData(t$.theme['.' + o.className])) {
				t$.extend(t, t$.theme['.' + o.className]);
			}

			// Check for ID styles
			if(t$.hasData(t$.theme['#' + id])) {
				t$.extend(t, t$.theme['#' + id]);
			}
			
			t$.extend(t, o);

			if(type == 'Picker') {
				var pdata = t.data || [];
				this.elements[id] = t$.ui.picker(t, pdata);
			} else {
				this.elements[id] = Ti.UI['create' + type](t);
			}
			this.elements[id].id = id;
			// Is able to collect input?
			if(t$.ui.isInput(type)) {
				Ti.API.debug('======= === = Adding ID: ' + id);
				this.fields.push(id);
				
				// Masked input
				var self = this;
				if (this.elements[id].mask){
					this.elements[id].addEventListener("change", function(e) {
	    				self.Mask.mask(e.source, self.Mask[t.mask]);
					});
				}
			}
			// Masked Input
			// Validation
			// Event listener?
			if(t.events) {
				if(t$.isArray(t.events)) {
					for(var i in t.events) {
						this.elements[id].addEventListener(t.events[i].type, t.events[i].callback);
					}
				}
			}
			this.formView.add(this.elements[id]);
			return this.elements[id];
		}
	},
	getData : function() {
		var data = {}, self = this;
		t$.each(self.fields, function(i) {
			data[i] = self.elements[i].value;
		});
		return data;
	},
	clearData : function() {
		var data = {}, self = this;
		t$.each(self.fields, function(i) {
			data[i] = self.elements[i].value;
		});
		return data;
	},
	addTo : function(v) {
		v.add(this.formView);
	},
	onblur : function(field) {
		return this._validateField(field);
	},
	onchange : function(field) {
		return this._validateField(field);
	},
	onsubmit : function() {
		return this._validateForm();
	},
	setMessage : function(rule, message) {
		this.messages[rule] = message;
		// return this for chaining
		return this;
	},
	/*
	 * @public
	 * Registers a callback for a custom rule (i.e. callback_username_check)
	 */
	registerCallback : function(name, handler) {
		if(name && typeof name === 'string' && handler && typeof handler === 'function') {
			this.handlers[name] = handler;
		}

		// return this for chaining
		return this;
	},
	/*
	 * @private
	 * Runs the validation when the form is submitted.
	 */

	_validateForm : function(event) {
		this.errors = [];
		Ti.API.debug('#@### FIELDS LENGTH: ' + this.fields.length);
		for(var k in this.fields) {
			k = this.fields[k];
			if(this.elements[k].rules) {
				Ti.API.debug('#@### FIELD: ' + k);
				this._validateField(this.elements[k]);
			}
		}

		if( typeof this.callback === 'function') {
			this.callback(this.errors, event);
		}

		if(this.errors.length > 0) {
			if(event && event.preventDefault) {
				event.preventDefault();
			} else {
				// IE6 doesn't pass in an event parameter so return false
				return false;
			}
		}

		return true;
	},
	/*
	 * @private
	 * Looks at the fields value and evaluates it against the given rules
	 */

	_validateField : function(field) {

		var rules = field.rules.split('|');

		Ti.API.debug('#@### CHECKING FOR: ' + field.rules);
		/*
		 * If the value is null and not required, we don't need to run through validation
		 */

		if(field.rules.indexOf('required') === -1 && t$.hasData(field.value)) {
			return;
		}

		/*
		 * Run through the rules and execute the validation methods as needed
		 */

		for(var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
			var method = rules[i], param = null, failed = false;

			/*
			 * If the rule has a parameter (i.e. matches[param]) split it out
			 */

			if( parts = ruleRegex.exec(method)) {
				method = parts[1];
				param = parts[2];
			}

			/*
			 * If the hook is defined, run it to find any validation errors
			 */

			if( typeof this._hooks[method] === 'function') {
				if(!this._hooks[method].apply(this, [field, param])) {
					failed = true;
				}
			} else if(method.substring(0, 9) === 'callback_') {
				// Custom method. Execute the handler if it was registered
				method = method.substring(9, method.length);

				if( typeof this.handlers[method] === 'function') {
					if(this.handlers[method].apply(this, [field.value]) === false) {
						failed = true;
					}
				}
			}

			/*
			 * If the hook failed, add a message to the errors array
			 */

			if(failed) {
				//field.backgroundColor = '#fff';
				field.borderWidth = 3;
				field.borderColor = '#c00000';
				// Make sure we have a message for this rule
				var source = this.messages[method] || defaults.messages[method];

				if(source) {
					var message = source.replace('%s', field.id);

					if(param) {
						message = message.replace('%s', (this.fields[param]) ? this.fields[param].id : param);
					}

					this.errors.push(message);
				} else {
					this.errors.push('An error has occurred with the ' + field.id + ' field.');
				}

				// Break out so as to not spam with validation errors (i.e. required and valid_email)
				break;
			}
		}
	},
	/*
	 * @private
	 * Object containing all of the validation hooks
	 */

	_hooks : {
		required : function(field) {
			var value = field.value;

			if(field.type === 'checkbox') {
				return (field.checked === true);
			}

			return (value !== null && value !== '');
		},
		matches : function(field, matchName) {
			if( el = this.field[matchName]) {
				return field.value === el.value;
			}

			return false;
		},
		valid_email : function(field) {
			return emailRegex.test(field.value);
		},
		valid_emails : function(field) {
			var result = field.value.split(",");
			for(var i = 0; i < result.length; i++) {
				if(!emailRegex.test(result[i])) {
					return false;
				}
			}

			return true;
		},
		min_length : function(field, length) {
			if(!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length >= length);
		},
		max_length : function(field, length) {
			if(!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length <= length);
		},
		exact_length : function(field, length) {
			if(!numericRegex.test(length)) {
				return false;
			}

			return (field.value.length == length);
		},
		greater_than : function(field, param) {
			if(!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) > parseFloat(param));
		},
		less_than : function(field, param) {
			if(!decimalRegex.test(field.value)) {
				return false;
			}

			return (parseFloat(field.value) < parseFloat(param));
		},
		alpha : function(field) {
			return (alphaRegex.test(field.value));
		},
		alpha_numeric : function(field) {
			return (alphaNumericRegex.test(field.value));
		},
		alpha_dash : function(field) {
			return (alphaDashRegex.test(field.value));
		},
		numeric : function(field) {
			return (decimalRegex.test(field.value));
		},
		integer : function(field) {
			return (integerRegex.test(field.value));
		},
		decimal : function(field) {
			return (decimalRegex.test(field.value));
		},
		is_natural : function(field) {
			return (naturalRegex.test(field.value));
		},
		is_natural_no_zero : function(field) {
			return (naturalNoZeroRegex.test(field.value));
		},
		valid_ip : function(field) {
			return (ipRegex.test(field.value));
		},
		valid_base64 : function(field) {
			return (base64Regex.test(field.value));
		}
	},
	Mask : {
		mask : function(fld, func, oParams) {
			if(oParams)
				fld.value = func(fld.value, oParams);
			else
				fld.value = func(fld.value);
		},
		generic : function(v, oParams) {
			var _regex = oParams.regex;
			var _syntax = oParams.syntax;
			var _maxValue = oParams.maxValue;
			v = v.replace(/D/g, "");
			v = v.replace(_regex, _syntax);

			return (_maxValue != null) ? v.slice(0, _maxValue) : v;
		},
		postcode : function(v) {
			v = v.replace(/D/g, "");
			v = v.replace(/^(\d{5})(\d)/, "$1-$2");
			return v.slice(0, 9);
		},
		phone : function(v) {
			v = v.replace(/\D/g, "");
			v = v.replace(/^(\d{3})(\d)/g, "($1) $2");
			v = v.replace(/(\d{4})(\d)/, "$1-$2");
			return v.slice(0, 14);
		}
	}
};
var defaults = {
	messages : {
		required : 'The %s field is required.',
		matches : 'The %s field does not match the %s field.',
		valid_email : 'The %s field must contain a valid email address.',
		valid_emails : 'The %s field must contain all valid email addresses.',
		min_length : 'The %s field must be at least %s characters in length.',
		max_length : 'The %s field must not exceed %s characters in length.',
		exact_length : 'The %s field must be exactly %s characters in length.',
		greater_than : 'The %s field must contain a number greater than %s.',
		less_than : 'The %s field must contain a number less than %s.',
		alpha : 'The %s field must only contain alphabetical characters.',
		alpha_numeric : 'The %s field must only contain alpha-numeric characters.',
		alpha_dash : 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
		numeric : 'The %s field must contain only numbers.',
		integer : 'The %s field must contain an integer.',
		decimal : 'The %s field must contain a decimal number.',
		is_natural : 'The %s field must contain only positive numbers.',
		is_natural_no_zero : 'The %s field must contain a number greater than zero.',
		valid_ip : 'The %s field must contain a valid IP.',
		valid_base64 : 'The %s field must contain a base64 string.'
	},
	callback : function(errors) {

	}
};

/*
 * Define the regular expressions that will be used
 */

var ruleRegex = /^(.+)\[(.+)\]$/, numericRegex = /^[0-9]+$/, integerRegex = /^\-?[0-9]+$/, decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i, alphaRegex = /^[a-z]+$/i, alphaNumericRegex = /^[a-z0-9]+$/i, alphaDashRegex = /^[a-z0-9_-]+$/i, naturalRegex = /^[0-9]+$/i, naturalNoZeroRegex = /^[1-9][0-9]*$/i, ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i;
