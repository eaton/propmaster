import test from 'ava'
import * as dot from "../src/functions/dot.js";
import { all, nested, arrays, unsupported } from './fixtures/values.js'

test('clone all types', t => {
  const cloned = dot.clone(all);
  t.deepEqual(all, cloned);
});

test('compare all types', t => {
  const cloned = dot.clone(all);
  t.is(dot.equals(all, cloned), true);
});

test('object merge', t => {
  const partial = { 
    l1: { 
      value: [ 4 ],
      l2: 'override',
    },
    new: 'text',
  };

  const mergedObject = dot.merge([ nested, partial ]);

  t.deepEqual(dot.get(mergedObject, 'l1.value'), [...nested.l1.value, 4]);
  t.is(dot.get(mergedObject, 'l1.l2'), 'override');
  t.is(dot.get(mergedObject, 'new'), 'text');
});

test('check properties', t => {
  t.is(dot.has(nested, 'l1.l2.l3.array.0.value'), true);
  t.is(dot.has(nested, 'missing'), false);
  t.is(dot.has(nested, 'l1.value.0'), true);
  t.is(dot.has(nested, 'l1.value.100'), false);
});

test('get properties', t => {
  t.is(dot.get(nested, 'l1.l2.l3.array.0.value'), 1);
  t.is(dot.get(nested, 'missing'), undefined);
  t.is(dot.get(nested, 'l1.value.0'), 1);
  t.is(dot.get(nested, 'l1.value.0', 'default'), 1);
  t.deepEqual(dot.get(nested, 'l1.value'), [1, 2, 3]);
  t.is(dot.get(nested, 'l1.value.100'), undefined);
  t.is(dot.get(nested, 'l1.value.100', 'default'), 'default');
});

test('set properties', t => {
  const cloned = dot.clone(nested);
  t.deepEqual(nested, cloned);
  
  dot.set(cloned, 'l1', 1);
  t.is(dot.get(cloned, 'l1'), 1);
  t.not(dot.get(nested, 'l1'), 1);
});

test('unset properties', t => {
  const cloned = dot.clone(nested);
  t.deepEqual(nested, cloned);

  dot.unset(cloned, 'l1');
  t.is(dot.get(cloned, 'l1'), undefined);

  dot.unset(cloned, 'value[0]');
  t.deepEqual(dot.get(cloned, 'value'), [undefined, 2, 3]);

  dot.set(cloned, 'value', undefined);
  t.is(dot.get(cloned, 'value'), undefined);
});

test('clone properties', t => {
  const target = {};
  dot.copy(nested, 'l1', target);
  t.deepEqual(dot.get(target, 'l1'), nested.l1);

  dot.copy(nested, 'l1', target, 'alternate');
  t.deepEqual(dot.get(target, 'alternate'), nested.l1);
});


test('array selection', t => {
  // Simple access
  t.is(dot.get(arrays, 'strings[0]'), 'first');
  t.is(dot.get(arrays, 'strings.[0]'), 'first');
  t.is(dot.get(arrays, 'strings.0'), 'first');

  // Wildcard selector for full array
  t.deepEqual(dot.get(arrays, 'numbers'), [1, 2, 3, 4]);
  t.deepEqual(dot.get(arrays, 'numbers.[*]'), [1, 2, 3, 4]);

  // Wildcard selector with sub-property reference 
  t.deepEqual(dot.get(nested, 'l1.l2.l3.array.[*].value'), [1, 2]);
});

// We'd like to add this in the future, but ts-dot-prop doesn't handle it yet.
test.failing('novelty array offsets', t => {
  t.is(dot.get(arrays, 'numbers.[-1]'), 3);
  t.deepEqual(dot.get(arrays, 'numbers.[0-1]'), [1, 2]);
});

// We'd like to support these types, but they're just all around unhappy
test.failing('unsupported types', t => {
  const cloned = dot.clone(unsupported);
  t.deepEqual(unsupported, cloned);
});

// Waiting on https://github.com/justinlettau/ts-dot-prop/pull/75
test.failing('unset a single array item', t => {
  const clone = dot.clone(arrays);
  dot.unset(clone, 'numbers.0')
  t.deepEqual(dot.get(clone, 'numbers'), [2, 3]);
});
