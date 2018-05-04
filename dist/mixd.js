var mixd = (function (exports) {
	'use strict';

	var toStr = Object.prototype.toString;

	var isArguments = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};

	var isArguments$1 = /*#__PURE__*/Object.freeze({
		default: isArguments,
		__moduleExports: isArguments
	});

	var isArgs = ( isArguments$1 && isArguments ) || isArguments$1;

	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr$1 = Object.prototype.toString;
	var slice = Array.prototype.slice;

	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	var keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr$1.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr$1.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};

	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2));
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		} else {
			Object.keys = keysShim;
		}
		return Object.keys || keysShim;
	};

	var objectKeys = keysShim;

	var objectKeys$1 = /*#__PURE__*/Object.freeze({
		default: objectKeys,
		__moduleExports: objectKeys
	});

	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	var foreach = function forEach (obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};

	var foreach$1 = /*#__PURE__*/Object.freeze({
		default: foreach,
		__moduleExports: foreach
	});

	var keys = ( objectKeys$1 && objectKeys ) || objectKeys$1;

	var foreach$2 = ( foreach$1 && foreach ) || foreach$1;

	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

	var toStr$2 = Object.prototype.toString;

	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr$2.call(fn) === '[object Function]';
	};

	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	        /* eslint-disable no-unused-vars, no-restricted-syntax */
	        for (var _ in obj) { return false; }
	        /* eslint-enable no-unused-vars, no-restricted-syntax */
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};

	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) {
			props = props.concat(Object.getOwnPropertySymbols(map));
		}
		foreach$2(props, function (name) {
			defineProperty(object, name, map[name], predicates[name]);
		});
	};

	defineProperties.supportsDescriptors = !!supportsDescriptors;

	var defineProperties_1 = defineProperties;

	var defineProperties$1 = /*#__PURE__*/Object.freeze({
		default: defineProperties_1,
		__moduleExports: defineProperties_1
	});

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice$1 = Array.prototype.slice;
	var toStr$3 = Object.prototype.toString;
	var funcType = '[object Function]';

	var implementation = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr$3.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice$1.call(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice$1.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice$1.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};

	var implementation$1 = /*#__PURE__*/Object.freeze({
		default: implementation,
		__moduleExports: implementation
	});

	var implementation$2 = ( implementation$1 && implementation ) || implementation$1;

	var functionBind = Function.prototype.bind || implementation$2;

	var functionBind$1 = /*#__PURE__*/Object.freeze({
		default: functionBind,
		__moduleExports: functionBind
	});

	var bind = ( functionBind$1 && functionBind ) || functionBind$1;

	var src = bind.call(Function.call, Object.prototype.hasOwnProperty);

	var src$1 = /*#__PURE__*/Object.freeze({
		default: src,
		__moduleExports: src
	});

	var isPrimitive = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var isPrimitive$1 = /*#__PURE__*/Object.freeze({
		default: isPrimitive,
		__moduleExports: isPrimitive
	});

	var fnToStr = Function.prototype.toString;

	var constructorRegex = /^\s*class /;
	var isES6ClassFn = function isES6ClassFn(value) {
		try {
			var fnStr = fnToStr.call(value);
			var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
			var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
			var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
			return constructorRegex.test(spaceStripped);
		} catch (e) {
			return false; // not a function
		}
	};

	var tryFunctionObject = function tryFunctionObject(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr$4 = Object.prototype.toString;
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isCallable = function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr$4.call(value);
		return strClass === fnClass || strClass === genClass;
	};

	var isCallable$1 = /*#__PURE__*/Object.freeze({
		default: isCallable,
		__moduleExports: isCallable
	});

	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateObject(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};

	var toStr$5 = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isDateObject = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) { return false; }
		return hasToStringTag$1 ? tryDateObject(value) : toStr$5.call(value) === dateClass;
	};

	var isDateObject$1 = /*#__PURE__*/Object.freeze({
		default: isDateObject,
		__moduleExports: isDateObject
	});

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var isSymbol = createCommonjsModule(function (module) {

	var toStr = Object.prototype.toString;
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

	if (hasSymbols) {
		var symToStr = Symbol.prototype.toString;
		var symStringRegex = /^Symbol\(.*\)$/;
		var isSymbolObject = function isSymbolObject(value) {
			if (typeof value.valueOf() !== 'symbol') { return false; }
			return symStringRegex.test(symToStr.call(value));
		};
		module.exports = function isSymbol(value) {
			if (typeof value === 'symbol') { return true; }
			if (toStr.call(value) !== '[object Symbol]') { return false; }
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else {
		module.exports = function isSymbol(value) {
			// this environment does not support Symbols.
			return false;
		};
	}
	});

	var isSymbol$1 = /*#__PURE__*/Object.freeze({
		default: isSymbol,
		__moduleExports: isSymbol
	});

	var isPrimitive$2 = ( isPrimitive$1 && isPrimitive ) || isPrimitive$1;

	var isCallable$2 = ( isCallable$1 && isCallable ) || isCallable$1;

	var isDate = ( isDateObject$1 && isDateObject ) || isDateObject$1;

	var isSymbol$2 = ( isSymbol$1 && isSymbol ) || isSymbol$1;

	var hasSymbols$1 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






	var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
		if (typeof O === 'undefined' || O === null) {
			throw new TypeError('Cannot call method on ' + O);
		}
		if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
			throw new TypeError('hint must be "string" or "number"');
		}
		var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
		var method, result, i;
		for (i = 0; i < methodNames.length; ++i) {
			method = O[methodNames[i]];
			if (isCallable$2(method)) {
				result = method.call(O);
				if (isPrimitive$2(result)) {
					return result;
				}
			}
		}
		throw new TypeError('No default value');
	};

	var GetMethod = function GetMethod(O, P) {
		var func = O[P];
		if (func !== null && typeof func !== 'undefined') {
			if (!isCallable$2(func)) {
				throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
			}
			return func;
		}
	};

	// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
	var es6 = function ToPrimitive(input, PreferredType) {
		if (isPrimitive$2(input)) {
			return input;
		}
		var hint = 'default';
		if (arguments.length > 1) {
			if (PreferredType === String) {
				hint = 'string';
			} else if (PreferredType === Number) {
				hint = 'number';
			}
		}

		var exoticToPrim;
		if (hasSymbols$1) {
			if (Symbol.toPrimitive) {
				exoticToPrim = GetMethod(input, Symbol.toPrimitive);
			} else if (isSymbol$2(input)) {
				exoticToPrim = Symbol.prototype.valueOf;
			}
		}
		if (typeof exoticToPrim !== 'undefined') {
			var result = exoticToPrim.call(input, hint);
			if (isPrimitive$2(result)) {
				return result;
			}
			throw new TypeError('unable to convert exotic object to primitive');
		}
		if (hint === 'default' && (isDate(input) || isSymbol$2(input))) {
			hint = 'string';
		}
		return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
	};

	var es6$1 = /*#__PURE__*/Object.freeze({
		default: es6,
		__moduleExports: es6
	});

	var _isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};

	var _isNaN$1 = /*#__PURE__*/Object.freeze({
		default: _isNaN,
		__moduleExports: _isNaN
	});

	var $isNaN = Number.isNaN || function (a) { return a !== a; };

	var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

	var _isFinite$1 = /*#__PURE__*/Object.freeze({
		default: _isFinite,
		__moduleExports: _isFinite
	});

	var has$1 = Object.prototype.hasOwnProperty;
	var assign = function assign(target, source) {
		if (Object.assign) {
			return Object.assign(target, source);
		}
		for (var key in source) {
			if (has$1.call(source, key)) {
				target[key] = source[key];
			}
		}
		return target;
	};

	var assign$1 = /*#__PURE__*/Object.freeze({
		default: assign,
		__moduleExports: assign
	});

	var sign = function sign(number) {
		return number >= 0 ? 1 : -1;
	};

	var sign$1 = /*#__PURE__*/Object.freeze({
		default: sign,
		__moduleExports: sign
	});

	var mod = function mod(number, modulo) {
		var remain = number % modulo;
		return Math.floor(remain >= 0 ? remain : remain + modulo);
	};

	var mod$1 = /*#__PURE__*/Object.freeze({
		default: mod,
		__moduleExports: mod
	});

	var isPrimitive$3 = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var isPrimitive$4 = /*#__PURE__*/Object.freeze({
		default: isPrimitive$3,
		__moduleExports: isPrimitive$3
	});

	var toStr$6 = Object.prototype.toString;





	// https://es5.github.io/#x8.12
	var ES5internalSlots = {
		'[[DefaultValue]]': function (O, hint) {
			var actualHint = hint || (toStr$6.call(O) === '[object Date]' ? String : Number);

			if (actualHint === String || actualHint === Number) {
				var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
				var value, i;
				for (i = 0; i < methods.length; ++i) {
					if (isCallable$2(O[methods[i]])) {
						value = O[methods[i]]();
						if (isPrimitive$2(value)) {
							return value;
						}
					}
				}
				throw new TypeError('No default value');
			}
			throw new TypeError('invalid [[DefaultValue]] hint supplied');
		}
	};

	// https://es5.github.io/#x9
	var es5 = function ToPrimitive(input, PreferredType) {
		if (isPrimitive$2(input)) {
			return input;
		}
		return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
	};

	var es5$1 = /*#__PURE__*/Object.freeze({
		default: es5,
		__moduleExports: es5
	});

	var $isNaN$1 = ( _isNaN$1 && _isNaN ) || _isNaN$1;

	var $isFinite = ( _isFinite$1 && _isFinite ) || _isFinite$1;

	var sign$2 = ( sign$1 && sign ) || sign$1;

	var mod$2 = ( mod$1 && mod ) || mod$1;

	var toPrimitive = ( es5$1 && es5 ) || es5$1;

	var has$2 = ( src$1 && src ) || src$1;

	// https://es5.github.io/#x9
	var ES5 = {
		ToPrimitive: toPrimitive,

		ToBoolean: function ToBoolean(value) {
			return !!value;
		},
		ToNumber: function ToNumber(value) {
			return Number(value);
		},
		ToInteger: function ToInteger(value) {
			var number = this.ToNumber(value);
			if ($isNaN$1(number)) { return 0; }
			if (number === 0 || !$isFinite(number)) { return number; }
			return sign$2(number) * Math.floor(Math.abs(number));
		},
		ToInt32: function ToInt32(x) {
			return this.ToNumber(x) >> 0;
		},
		ToUint32: function ToUint32(x) {
			return this.ToNumber(x) >>> 0;
		},
		ToUint16: function ToUint16(value) {
			var number = this.ToNumber(value);
			if ($isNaN$1(number) || number === 0 || !$isFinite(number)) { return 0; }
			var posInt = sign$2(number) * Math.floor(Math.abs(number));
			return mod$2(posInt, 0x10000);
		},
		ToString: function ToString(value) {
			return String(value);
		},
		ToObject: function ToObject(value) {
			this.CheckObjectCoercible(value);
			return Object(value);
		},
		CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
			/* jshint eqnull:true */
			if (value == null) {
				throw new TypeError(optMessage || 'Cannot call method on ' + value);
			}
			return value;
		},
		IsCallable: isCallable$2,
		SameValue: function SameValue(x, y) {
			if (x === y) { // 0 === -0, but they are not identical.
				if (x === 0) { return 1 / x === 1 / y; }
				return true;
			}
			return $isNaN$1(x) && $isNaN$1(y);
		},

		// http://www.ecma-international.org/ecma-262/5.1/#sec-8
		Type: function Type(x) {
			if (x === null) {
				return 'Null';
			}
			if (typeof x === 'undefined') {
				return 'Undefined';
			}
			if (typeof x === 'function' || typeof x === 'object') {
				return 'Object';
			}
			if (typeof x === 'number') {
				return 'Number';
			}
			if (typeof x === 'boolean') {
				return 'Boolean';
			}
			if (typeof x === 'string') {
				return 'String';
			}
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
		IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
			if (this.Type(Desc) !== 'Object') {
				return false;
			}
			var allowed = {
				'[[Configurable]]': true,
				'[[Enumerable]]': true,
				'[[Get]]': true,
				'[[Set]]': true,
				'[[Value]]': true,
				'[[Writable]]': true
			};
			// jscs:disable
			for (var key in Desc) { // eslint-disable-line
				if (has$2(Desc, key) && !allowed[key]) {
					return false;
				}
			}
			// jscs:enable
			var isData = has$2(Desc, '[[Value]]');
			var IsAccessor = has$2(Desc, '[[Get]]') || has$2(Desc, '[[Set]]');
			if (isData && IsAccessor) {
				throw new TypeError('Property Descriptors may not be both accessor and data descriptors');
			}
			return true;
		},

		// http://ecma-international.org/ecma-262/5.1/#sec-8.10.1
		IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!this.IsPropertyDescriptor(Desc)) {
				throw new TypeError('Desc must be a Property Descriptor');
			}

			if (!has$2(Desc, '[[Get]]') && !has$2(Desc, '[[Set]]')) {
				return false;
			}

			return true;
		},

		// http://ecma-international.org/ecma-262/5.1/#sec-8.10.2
		IsDataDescriptor: function IsDataDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!this.IsPropertyDescriptor(Desc)) {
				throw new TypeError('Desc must be a Property Descriptor');
			}

			if (!has$2(Desc, '[[Value]]') && !has$2(Desc, '[[Writable]]')) {
				return false;
			}

			return true;
		},

		// http://ecma-international.org/ecma-262/5.1/#sec-8.10.3
		IsGenericDescriptor: function IsGenericDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!this.IsPropertyDescriptor(Desc)) {
				throw new TypeError('Desc must be a Property Descriptor');
			}

			if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
				return true;
			}

			return false;
		},

		// http://ecma-international.org/ecma-262/5.1/#sec-8.10.4
		FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return Desc;
			}

			if (!this.IsPropertyDescriptor(Desc)) {
				throw new TypeError('Desc must be a Property Descriptor');
			}

			if (this.IsDataDescriptor(Desc)) {
				return {
					value: Desc['[[Value]]'],
					writable: !!Desc['[[Writable]]'],
					enumerable: !!Desc['[[Enumerable]]'],
					configurable: !!Desc['[[Configurable]]']
				};
			} else if (this.IsAccessorDescriptor(Desc)) {
				return {
					get: Desc['[[Get]]'],
					set: Desc['[[Set]]'],
					enumerable: !!Desc['[[Enumerable]]'],
					configurable: !!Desc['[[Configurable]]']
				};
			} else {
				throw new TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
			}
		},

		// http://ecma-international.org/ecma-262/5.1/#sec-8.10.5
		ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
			if (this.Type(Obj) !== 'Object') {
				throw new TypeError('ToPropertyDescriptor requires an object');
			}

			var desc = {};
			if (has$2(Obj, 'enumerable')) {
				desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
			}
			if (has$2(Obj, 'configurable')) {
				desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
			}
			if (has$2(Obj, 'value')) {
				desc['[[Value]]'] = Obj.value;
			}
			if (has$2(Obj, 'writable')) {
				desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
			}
			if (has$2(Obj, 'get')) {
				var getter = Obj.get;
				if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
					throw new TypeError('getter must be a function');
				}
				desc['[[Get]]'] = getter;
			}
			if (has$2(Obj, 'set')) {
				var setter = Obj.set;
				if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
					throw new TypeError('setter must be a function');
				}
				desc['[[Set]]'] = setter;
			}

			if ((has$2(desc, '[[Get]]') || has$2(desc, '[[Set]]')) && (has$2(desc, '[[Value]]') || has$2(desc, '[[Writable]]'))) {
				throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
			}
			return desc;
		}
	};

	var es5$2 = ES5;

	var es5$3 = /*#__PURE__*/Object.freeze({
		default: es5$2,
		__moduleExports: es5$2
	});

	var regexExec = RegExp.prototype.exec;
	var gOPD = Object.getOwnPropertyDescriptor;

	var tryRegexExecCall = function tryRegexExec(value) {
		try {
			var lastIndex = value.lastIndex;
			value.lastIndex = 0;

			regexExec.call(value);
			return true;
		} catch (e) {
			return false;
		} finally {
			value.lastIndex = lastIndex;
		}
	};
	var toStr$7 = Object.prototype.toString;
	var regexClass = '[object RegExp]';
	var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isRegex = function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}
		if (!hasToStringTag$2) {
			return toStr$7.call(value) === regexClass;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && has$2(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		return tryRegexExecCall(value);
	};

	var isRegex$1 = /*#__PURE__*/Object.freeze({
		default: isRegex,
		__moduleExports: isRegex
	});

	var toPrimitive$1 = ( es6$1 && es6 ) || es6$1;

	var assign$2 = ( assign$1 && assign ) || assign$1;

	var isPrimitive$5 = ( isPrimitive$4 && isPrimitive$3 ) || isPrimitive$4;

	var ES5$1 = ( es5$3 && es5$2 ) || es5$3;

	var hasRegExpMatcher = ( isRegex$1 && isRegex ) || isRegex$1;

	var toStr$8 = Object.prototype.toString;
	var hasSymbols$2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
	var SymbolIterator = hasSymbols$2 ? Symbol.iterator : null;



	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;





	var parseInteger = parseInt;

	var arraySlice = bind.call(Function.call, Array.prototype.slice);
	var strSlice = bind.call(Function.call, String.prototype.slice);
	var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
	var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
	var regexExec$1 = bind.call(Function.call, RegExp.prototype.exec);
	var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
	var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
	var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
	var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
	var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

	// whitespace from: http://es5.github.io/#x15.5.4.20
	// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
	var ws = [
		'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
		'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
		'\u2029\uFEFF'
	].join('');
	var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
	var replace = bind.call(Function.call, String.prototype.replace);
	var trim = function (value) {
		return replace(value, trimRegex, '');
	};





	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
	var ES6 = assign$2(assign$2({}, ES5$1), {

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
		Call: function Call(F, V) {
			var args = arguments.length > 2 ? arguments[2] : [];
			if (!this.IsCallable(F)) {
				throw new TypeError(F + ' is not a function');
			}
			return F.apply(V, args);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
		ToPrimitive: toPrimitive$1,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
		// ToBoolean: ES5.ToBoolean,

		// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
		ToNumber: function ToNumber(argument) {
			var value = isPrimitive$5(argument) ? argument : toPrimitive$1(argument, Number);
			if (typeof value === 'symbol') {
				throw new TypeError('Cannot convert a Symbol value to a number');
			}
			if (typeof value === 'string') {
				if (isBinary(value)) {
					return this.ToNumber(parseInteger(strSlice(value, 2), 2));
				} else if (isOctal(value)) {
					return this.ToNumber(parseInteger(strSlice(value, 2), 8));
				} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
					return NaN;
				} else {
					var trimmed = trim(value);
					if (trimmed !== value) {
						return this.ToNumber(trimmed);
					}
				}
			}
			return Number(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
		// ToInteger: ES5.ToNumber,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
		// ToInt32: ES5.ToInt32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
		// ToUint32: ES5.ToUint32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
		ToInt16: function ToInt16(argument) {
			var int16bit = this.ToUint16(argument);
			return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
		// ToUint16: ES5.ToUint16,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
		ToInt8: function ToInt8(argument) {
			var int8bit = this.ToUint8(argument);
			return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
		ToUint8: function ToUint8(argument) {
			var number = this.ToNumber(argument);
			if ($isNaN$1(number) || number === 0 || !$isFinite(number)) { return 0; }
			var posInt = sign$2(number) * Math.floor(Math.abs(number));
			return mod$2(posInt, 0x100);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
		ToUint8Clamp: function ToUint8Clamp(argument) {
			var number = this.ToNumber(argument);
			if ($isNaN$1(number) || number <= 0) { return 0; }
			if (number >= 0xFF) { return 0xFF; }
			var f = Math.floor(argument);
			if (f + 0.5 < number) { return f + 1; }
			if (number < f + 0.5) { return f; }
			if (f % 2 !== 0) { return f + 1; }
			return f;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
		ToString: function ToString(argument) {
			if (typeof argument === 'symbol') {
				throw new TypeError('Cannot convert a Symbol value to a string');
			}
			return String(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
		ToObject: function ToObject(value) {
			this.RequireObjectCoercible(value);
			return Object(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
		ToPropertyKey: function ToPropertyKey(argument) {
			var key = this.ToPrimitive(argument, String);
			return typeof key === 'symbol' ? key : this.ToString(key);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
		ToLength: function ToLength(argument) {
			var len = this.ToInteger(argument);
			if (len <= 0) { return 0; } // includes converting -0 to +0
			if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
			return len;
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
		CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
			if (toStr$8.call(argument) !== '[object String]') {
				throw new TypeError('must be a string');
			}
			if (argument === '-0') { return -0; }
			var n = this.ToNumber(argument);
			if (this.SameValue(this.ToString(n), argument)) { return n; }
			return void 0;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
		RequireObjectCoercible: ES5$1.CheckObjectCoercible,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
		IsArray: Array.isArray || function IsArray(argument) {
			return toStr$8.call(argument) === '[object Array]';
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
		// IsCallable: ES5.IsCallable,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
		IsConstructor: function IsConstructor(argument) {
			return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
		IsExtensible: function IsExtensible(obj) {
			if (!Object.preventExtensions) { return true; }
			if (isPrimitive$5(obj)) {
				return false;
			}
			return Object.isExtensible(obj);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
		IsInteger: function IsInteger(argument) {
			if (typeof argument !== 'number' || $isNaN$1(argument) || !$isFinite(argument)) {
				return false;
			}
			var abs = Math.abs(argument);
			return Math.floor(abs) === abs;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
		IsPropertyKey: function IsPropertyKey(argument) {
			return typeof argument === 'string' || typeof argument === 'symbol';
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
		IsRegExp: function IsRegExp(argument) {
			if (!argument || typeof argument !== 'object') {
				return false;
			}
			if (hasSymbols$2) {
				var isRegExp = argument[Symbol.match];
				if (typeof isRegExp !== 'undefined') {
					return ES5$1.ToBoolean(isRegExp);
				}
			}
			return hasRegExpMatcher(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
		// SameValue: ES5.SameValue,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
		SameValueZero: function SameValueZero(x, y) {
			return (x === y) || ($isNaN$1(x) && $isNaN$1(y));
		},

		/**
		 * 7.3.2 GetV (V, P)
		 * 1. Assert: IsPropertyKey(P) is true.
		 * 2. Let O be ToObject(V).
		 * 3. ReturnIfAbrupt(O).
		 * 4. Return O.[[Get]](P, V).
		 */
		GetV: function GetV(V, P) {
			// 7.3.2.1
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}

			// 7.3.2.2-3
			var O = this.ToObject(V);

			// 7.3.2.4
			return O[P];
		},

		/**
		 * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
		 * 1. Assert: IsPropertyKey(P) is true.
		 * 2. Let func be GetV(O, P).
		 * 3. ReturnIfAbrupt(func).
		 * 4. If func is either undefined or null, return undefined.
		 * 5. If IsCallable(func) is false, throw a TypeError exception.
		 * 6. Return func.
		 */
		GetMethod: function GetMethod(O, P) {
			// 7.3.9.1
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}

			// 7.3.9.2
			var func = this.GetV(O, P);

			// 7.3.9.4
			if (func == null) {
				return void 0;
			}

			// 7.3.9.5
			if (!this.IsCallable(func)) {
				throw new TypeError(P + 'is not a function');
			}

			// 7.3.9.6
			return func;
		},

		/**
		 * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
		 * 1. Assert: Type(O) is Object.
		 * 2. Assert: IsPropertyKey(P) is true.
		 * 3. Return O.[[Get]](P, O).
		 */
		Get: function Get(O, P) {
			// 7.3.1.1
			if (this.Type(O) !== 'Object') {
				throw new TypeError('Assertion failed: Type(O) is not Object');
			}
			// 7.3.1.2
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}
			// 7.3.1.3
			return O[P];
		},

		Type: function Type(x) {
			if (typeof x === 'symbol') {
				return 'Symbol';
			}
			return ES5$1.Type(x);
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
		SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('Assertion failed: Type(O) is not Object');
			}
			var C = O.constructor;
			if (typeof C === 'undefined') {
				return defaultConstructor;
			}
			if (this.Type(C) !== 'Object') {
				throw new TypeError('O.constructor is not an Object');
			}
			var S = hasSymbols$2 && Symbol.species ? C[Symbol.species] : void 0;
			if (S == null) {
				return defaultConstructor;
			}
			if (this.IsConstructor(S)) {
				return S;
			}
			throw new TypeError('no constructor found');
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
		CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
			if (!this.IsPropertyDescriptor(Desc)) {
				throw new TypeError('Desc must be a Property Descriptor');
			}

			if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
				if (!has$2(Desc, '[[Value]]')) {
					Desc['[[Value]]'] = void 0;
				}
				if (!has$2(Desc, '[[Writable]]')) {
					Desc['[[Writable]]'] = false;
				}
			} else {
				if (!has$2(Desc, '[[Get]]')) {
					Desc['[[Get]]'] = void 0;
				}
				if (!has$2(Desc, '[[Set]]')) {
					Desc['[[Set]]'] = void 0;
				}
			}
			if (!has$2(Desc, '[[Enumerable]]')) {
				Desc['[[Enumerable]]'] = false;
			}
			if (!has$2(Desc, '[[Configurable]]')) {
				Desc['[[Configurable]]'] = false;
			}
			return Desc;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
		Set: function Set(O, P, V, Throw) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('P must be a Property Key');
			}
			if (this.Type(Throw) !== 'Boolean') {
				throw new TypeError('Throw must be a Boolean');
			}
			if (Throw) {
				O[P] = V;
				return true;
			} else {
				try {
					O[P] = V;
				} catch (e) {
					return false;
				}
			}
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
		HasOwnProperty: function HasOwnProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('P must be a Property Key');
			}
			return has$2(O, P);
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-hasproperty
		HasProperty: function HasProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('P must be a Property Key');
			}
			return P in O;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
		IsConcatSpreadable: function IsConcatSpreadable(O) {
			if (this.Type(O) !== 'Object') {
				return false;
			}
			if (hasSymbols$2 && typeof Symbol.isConcatSpreadable === 'symbol') {
				var spreadable = this.Get(O, Symbol.isConcatSpreadable);
				if (typeof spreadable !== 'undefined') {
					return this.ToBoolean(spreadable);
				}
			}
			return this.IsArray(O);
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-invoke
		Invoke: function Invoke(O, P) {
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('P must be a Property Key');
			}
			var argumentsList = arraySlice(arguments, 2);
			var func = this.GetV(O, P);
			return this.Call(func, O, argumentsList);
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-getiterator
		GetIterator: function GetIterator(obj, method) {
			if (!hasSymbols$2) {
				throw new SyntaxError('ES.GetIterator depends on native iterator support.');
			}

			var actualMethod = method;
			if (arguments.length < 2) {
				actualMethod = this.GetMethod(obj, SymbolIterator);
			}
			var iterator = this.Call(actualMethod, obj);
			if (this.Type(iterator) !== 'Object') {
				throw new TypeError('iterator must return an object');
			}

			return iterator;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-iteratornext
		IteratorNext: function IteratorNext(iterator, value) {
			var result = this.Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
			if (this.Type(result) !== 'Object') {
				throw new TypeError('iterator next must return an object');
			}
			return result;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete
		IteratorComplete: function IteratorComplete(iterResult) {
			if (this.Type(iterResult) !== 'Object') {
				throw new TypeError('Assertion failed: Type(iterResult) is not Object');
			}
			return this.ToBoolean(this.Get(iterResult, 'done'));
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue
		IteratorValue: function IteratorValue(iterResult) {
			if (this.Type(iterResult) !== 'Object') {
				throw new TypeError('Assertion failed: Type(iterResult) is not Object');
			}
			return this.Get(iterResult, 'value');
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-iteratorstep
		IteratorStep: function IteratorStep(iterator) {
			var result = this.IteratorNext(iterator);
			var done = this.IteratorComplete(result);
			return done === true ? false : result;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-iteratorclose
		IteratorClose: function IteratorClose(iterator, completion) {
			if (this.Type(iterator) !== 'Object') {
				throw new TypeError('Assertion failed: Type(iterator) is not Object');
			}
			if (!this.IsCallable(completion)) {
				throw new TypeError('Assertion failed: completion is not a thunk for a Completion Record');
			}
			var completionThunk = completion;

			var iteratorReturn = this.GetMethod(iterator, 'return');

			if (typeof iteratorReturn === 'undefined') {
				return completionThunk();
			}

			var completionRecord;
			try {
				var innerResult = this.Call(iteratorReturn, iterator, []);
			} catch (e) {
				// if we hit here, then "e" is the innerResult completion that needs re-throwing

				// if the completion is of type "throw", this will throw.
				completionRecord = completionThunk();
				completionThunk = null; // ensure it's not called twice.

				// if not, then return the innerResult completion
				throw e;
			}
			completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
			completionThunk = null; // ensure it's not called twice.

			if (this.Type(innerResult) !== 'Object') {
				throw new TypeError('iterator .return must return an object');
			}

			return completionRecord;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
		CreateIterResultObject: function CreateIterResultObject(value, done) {
			if (this.Type(done) !== 'Boolean') {
				throw new TypeError('Assertion failed: Type(done) is not Boolean');
			}
			return {
				value: value,
				done: done
			};
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-regexpexec
		RegExpExec: function RegExpExec(R, S) {
			if (this.Type(R) !== 'Object') {
				throw new TypeError('R must be an Object');
			}
			if (this.Type(S) !== 'String') {
				throw new TypeError('S must be a String');
			}
			var exec = this.Get(R, 'exec');
			if (this.IsCallable(exec)) {
				var result = this.Call(exec, R, [S]);
				if (result === null || this.Type(result) === 'Object') {
					return result;
				}
				throw new TypeError('"exec" method must return `null` or an Object');
			}
			return regexExec$1(R, S);
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate
		ArraySpeciesCreate: function ArraySpeciesCreate(originalArray, length) {
			if (!this.IsInteger(length) || length < 0) {
				throw new TypeError('Assertion failed: length must be an integer >= 0');
			}
			var len = length === 0 ? 0 : length;
			var C;
			var isArray = this.IsArray(originalArray);
			if (isArray) {
				C = this.Get(originalArray, 'constructor');
				// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
				// if (this.IsConstructor(C)) {
				// 	if C is another realm's Array, C = undefined
				// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
				// }
				if (this.Type(C) === 'Object' && hasSymbols$2 && Symbol.species) {
					C = this.Get(C, Symbol.species);
					if (C === null) {
						C = void 0;
					}
				}
			}
			if (typeof C === 'undefined') {
				return Array(len);
			}
			if (!this.IsConstructor(C)) {
				throw new TypeError('C must be a constructor');
			}
			return new C(len); // this.Construct(C, len);
		},

		CreateDataProperty: function CreateDataProperty(O, P, V) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('Assertion failed: Type(O) is not Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}
			var oldDesc = Object.getOwnPropertyDescriptor(O, P);
			var extensible = oldDesc || (typeof Object.isExtensible !== 'function' || Object.isExtensible(O));
			var immutable = oldDesc && (!oldDesc.writable || !oldDesc.configurable);
			if (immutable || !extensible) {
				return false;
			}
			var newDesc = {
				configurable: true,
				enumerable: true,
				value: V,
				writable: true
			};
			Object.defineProperty(O, P, newDesc);
			return true;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow
		CreateDataPropertyOrThrow: function CreateDataPropertyOrThrow(O, P, V) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('Assertion failed: Type(O) is not Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}
			var success = this.CreateDataProperty(O, P, V);
			if (!success) {
				throw new TypeError('unable to create data property');
			}
			return success;
		},

		// http://ecma-international.org/ecma-262/6.0/#sec-advancestringindex
		AdvanceStringIndex: function AdvanceStringIndex(S, index, unicode) {
			if (this.Type(S) !== 'String') {
				throw new TypeError('Assertion failed: Type(S) is not String');
			}
			if (!this.IsInteger(index)) {
				throw new TypeError('Assertion failed: length must be an integer >= 0 and <= (2**53 - 1)');
			}
			if (index < 0 || index > MAX_SAFE_INTEGER) {
				throw new RangeError('Assertion failed: length must be an integer >= 0 and <= (2**53 - 1)');
			}
			if (this.Type(unicode) !== 'Boolean') {
				throw new TypeError('Assertion failed: Type(unicode) is not Boolean');
			}
			if (!unicode) {
				return index + 1;
			}
			var length = S.length;
			if ((index + 1) >= length) {
				return index + 1;
			}
			var first = S.charCodeAt(index);
			if (first < 0xD800 || first > 0xDBFF) {
				return index + 1;
			}
			var second = S.charCodeAt(index + 1);
			if (second < 0xDC00 || second > 0xDFFF) {
				return index + 1;
			}
			return index + 2;
		}
	});

	delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

	var es2015 = ES6;

	var es2015$1 = /*#__PURE__*/Object.freeze({
		default: es2015,
		__moduleExports: es2015
	});

	var ES2015 = ( es2015$1 && es2015 ) || es2015$1;

	var ES2016 = assign$2(assign$2({}, ES2015), {
		// https://github.com/tc39/ecma262/pull/60
		SameValueNonNumber: function SameValueNonNumber(x, y) {
			if (typeof x === 'number' || typeof x !== typeof y) {
				throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
			}
			return this.SameValue(x, y);
		}
	});

	var es2016 = ES2016;

	var es2016$1 = /*#__PURE__*/Object.freeze({
		default: es2016,
		__moduleExports: es2016
	});

	var require$$0 = ( es2016$1 && es2016 ) || es2016$1;

	var es7 = require$$0;

	var es7$1 = /*#__PURE__*/Object.freeze({
		default: es7,
		__moduleExports: es7
	});

	var ES = ( es7$1 && es7 ) || es7$1;

	var defineProperty$1 = Object.defineProperty;
	var getDescriptor = Object.getOwnPropertyDescriptor;
	var getOwnNames = Object.getOwnPropertyNames;
	var getSymbols = Object.getOwnPropertySymbols;
	var concat = Function.call.bind(Array.prototype.concat);
	var reduce = Function.call.bind(Array.prototype.reduce);
	var getAll = getSymbols ? function (obj) {
		return concat(getOwnNames(obj), getSymbols(obj));
	} : getOwnNames;

	var isES5 = ES.IsCallable(getDescriptor) && ES.IsCallable(getOwnNames);

	var safePut = function put(obj, prop, val) { // eslint-disable-line max-params
		if (defineProperty$1 && prop in obj) {
			defineProperty$1(obj, prop, {
				configurable: true,
				enumerable: true,
				value: val,
				writable: true
			});
		} else {
			obj[prop] = val;
		}
	};

	var implementation$3 = function getOwnPropertyDescriptors(value) {
		ES.RequireObjectCoercible(value);
		if (!isES5) {
			throw new TypeError('getOwnPropertyDescriptors requires Object.getOwnPropertyDescriptor');
		}

		var O = ES.ToObject(value);
		return reduce(getAll(O), function (acc, key) {
			var descriptor = getDescriptor(O, key);
			if (typeof descriptor !== 'undefined') {
				safePut(acc, key, descriptor);
			}
			return acc;
		}, {});
	};

	var implementation$4 = /*#__PURE__*/Object.freeze({
		default: implementation$3,
		__moduleExports: implementation$3
	});

	var implementation$5 = ( implementation$4 && implementation$3 ) || implementation$4;

	var polyfill = function getPolyfill() {
		return typeof Object.getOwnPropertyDescriptors === 'function' ? Object.getOwnPropertyDescriptors : implementation$5;
	};

	var polyfill$1 = /*#__PURE__*/Object.freeze({
		default: polyfill,
		__moduleExports: polyfill
	});

	var getPolyfill = ( polyfill$1 && polyfill ) || polyfill$1;

	var define = ( defineProperties$1 && defineProperties_1 ) || defineProperties$1;

	var shim = function shimGetOwnPropertyDescriptors() {
		var polyfill = getPolyfill();
		define(
			Object,
			{ getOwnPropertyDescriptors: polyfill },
			{ getOwnPropertyDescriptors: function () { return Object.getOwnPropertyDescriptors !== polyfill; } }
		);
		return polyfill;
	};

	var shim$1 = /*#__PURE__*/Object.freeze({
		default: shim,
		__moduleExports: shim
	});

	var shim$2 = ( shim$1 && shim ) || shim$1;

	define(implementation$5, {
		getPolyfill: getPolyfill,
		implementation: implementation$5,
		shim: shim$2
	});

	var object_getownpropertydescriptors = implementation$5;

	function assign$3(dest){
	    var src = [], len = arguments.length - 1;
	    while ( len-- > 0 ) src[ len ] = arguments[ len + 1 ];

	    src.forEach(function (o){
	        Object.defineProperties(
	            dest,
	            object_getownpropertydescriptors(o)
	        );
	    });
	    return dest;
	}

	function mixin(Class, o){
	    if ( o === void 0 ) o = {};


	    var C = (function (Class) {
	        function C(){
	            var a = [], len = arguments.length;
	            while ( len-- ) a[ len ] = arguments[ len ];

	            Class.apply(this, a);
	            C[Symbol.for('@mixin.init')].apply(this, a);
	        }

	        if ( Class ) C.__proto__ = Class;
	        C.prototype = Object.create( Class && Class.prototype );
	        C.prototype.constructor = C;
	        C.create = function create (){
	            var a = [], len = arguments.length;
	            while ( len-- ) a[ len ] = arguments[ len ];

	            return new (Function.prototype.bind.apply( C, [ null ].concat( a) ));
	        };
	        C.mixin = function mixin$1 (o){
	            return mixin(C, o);
	        };

	        return C;
	    }(Class));

	    C[Symbol.for('@mixin.init')] = (
	        o.init === 'function'
	        ? o.init
	        : function (){}
	    );

	    assign$3(C.prototype, o);

	    return C;
	}

	function mixd(Class, o){
	    return mixin(Class, o);
	}

	exports.assign = assign$3;
	exports.mixd = mixd;

	return exports;

}({}));
//# sourceMappingURL=mixd.js.map
