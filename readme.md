# callbag-from-obs

Convert an observable (or subscribable) to a callbag listenable source.

`npm install callbag-from-obs`

## example

Convert an RxJS Observable:

```js
const Rx = require('rxjs');
const fromObs = require('callbag-from-obs');
const observe = require('callbag-observe');

const source = fromObs(Rx.Observable.interval(1000).take(4));

observe(x => console.log(x)(source); // 0
                                     // 1
                                     // 2
                                     // 3
```

Convert anything that has the `.subscribe` method:

```js
const fromObs = require('callbag-from-obs');
const observe = require('callbag-observe');

const subscribable = {
  subscribe: (observer) => {
    let i = 0;
    setInterval(() => observer.next(i++), 1000);
  }
};

const source = fromObs(subscribable);

observe(x => console.log(x))(source); // 0
                                      // 1
                                      // 2
                                      // 3
                                      // ...
```
