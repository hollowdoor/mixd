mixd
===

Install
---

`npm install mixd`

Example
---

```javascript
import {mixd} from 'mixd';

class T {
    constructor(v){
        this.value = v;
    }
    m0(){
        return 0;
    }
}
//Pass a class to mixd
const thing1 = mixd(T);
//thing1 is a class
//thing2 inherits from thing1
const thing2 = thing1.mixin({
    //init is called on object construction
    init(){
        console.log(this.value);
    },
    m1(){return 1},
    m2(){return 2},
    get m3(){return 3}
});

//.create is a static sugar method
//used to instantiate an object
let thing = thing2.create('I');
console.log(thing.m0())
console.log(thing.m1())
console.log(thing.m2())
console.log(thing.m3)
console.log(thing.value);
//new can be used instead of .create
let newThing = new thing2('V');
```

About
---

Use `mixd` to create class mixins.
