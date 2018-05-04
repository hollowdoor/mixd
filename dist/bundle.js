'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getDescriptors = _interopDefault(require('object.getownpropertydescriptors'));

function assign(dest){
    var src = [], len = arguments.length - 1;
    while ( len-- > 0 ) src[ len ] = arguments[ len + 1 ];

    src.forEach(function (o){
        Object.defineProperties(
            dest,
            getDescriptors(o)
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

    assign(C.prototype, o);

    return C;
}

function mixd(Class, o){
    return mixin(Class, o);
}

exports.assign = assign;
exports.mixd = mixd;
//# sourceMappingURL=bundle.js.map
