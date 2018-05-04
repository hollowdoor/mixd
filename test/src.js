const {mixd} = require('../');

class T {
    constructor(v){
        this.value = v;
    }
    m0(){
        return 0;
    }
}

const thing1 = mixd(T);
const thing2 = thing1.mixin({
    m1(){return 1},
    m2(){return 2},
    get m3(){return 3}
});

let thing = thing2.create('I');
console.log(thing.m0())
console.log(thing.m1())
console.log(thing.m2())
console.log(thing.m3)
console.log(thing.value);
