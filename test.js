const test = require('tape');
const $$observable = require('symbol-observable').default;
const fromObs = require('./readme');

test('it converts an async infinite subscribable', (t) => {
  t.plan(13);
  const source = fromObs({
    subscribe: (observer) => {
      let i = 0;
      let id = setInterval(() => observer.next(i++), 100);
      return function unsubscribe() {
        clearInterval(id);
      };
    }
  });

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number']
  ];

  const downwardsExpected = [0, 1, 2];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
      if (downwardsExpected.length === 0) {
        talkback(2);
        t.pass('sink disposes the source');
      }
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens after dispose()');
    t.end();
  }, 700);
});

test('it converts an async finite subscribable', (t) => {
  t.plan(14);
  const source = fromObs({
    subscribe: (observer) => {
      let i = 0;
      let id = setInterval(() => {
	observer.next(i);
	if (i === 2) {
          observer.complete();
	  clearInterval(id);
	  return;
	}
	i++;
      }, 100);
    }
  });

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined']
  ];

  const downwardsExpected = [0, 1, 2];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
    }
  });

  setTimeout(() => {
    t.equals(downwardsExpectedTypes.length, 0, 'everything expected happened');
    t.end();
  }, 700);
});

test('it converts a sync finite subscribable', (t) => {
  t.plan(14);
  const source = fromObs({
    subscribe: (observer) => {
      for (let i = 0; i < 3; i++) {
        observer.next(i);
      }
      observer.complete();
    }
  });

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined']
  ];

  const downwardsExpected = [0, 1, 2];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
    }
  });

  setTimeout(() => {
    t.equals(downwardsExpectedTypes.length, 0, 'everything expected happened');
    t.end();
  }, 100);
});

test('it converts using $$observable', (t) => {
  t.plan(13);
  const source = fromObs({
    [$$observable]() {
      return {
        subscribe(observer) {
          let i = 0;
          let id = setInterval(() => observer.next(i++), 100);
          return function unsubscribe() {
            clearInterval(id);
          };
        }
      }
    }
  });

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number']
  ];

  const downwardsExpected = [0, 1, 2];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
      if (downwardsExpected.length === 0) {
        talkback(2);
        t.pass('sink disposes the source');
      }
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens after dispose()');
    t.end();
  }, 700);
});

