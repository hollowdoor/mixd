import getDescriptors from 'object.getownpropertydescriptors';

export function assign(dest, ...src){
    src.forEach(o=>{
        Object.defineProperties(
            dest,
            getDescriptors(o)
        );
    });
    return dest;
}

function mixin(Class, o = {}){

    let C = class extends Class {
        constructor(...a){
            super(...a);
            C[Symbol.for('@mixin.init')].apply(this, a);
        }
        static create(...a){
            return new C(...a);
        }
        static mixin(o){
            return mixin(C, o);
        }
    };

    C[Symbol.for('@mixin.init')] = (
        o.init === 'function'
        ? o.init
        : ()=>{}
    );

    assign(C.prototype, o);

    return C;
}

export function mixd(Class, o){
    return mixin(Class, o);
}
