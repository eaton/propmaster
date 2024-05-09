import test from 'ava'
import { all } from './fixtures/values.js'
import { clone, get, set } from '../src/functions/dot.js';
import { Propmaster } from '../src/propmaster.js';

test('value checking', t => {
  const p = Propmaster.clone(all);
  t.is(p.get('primitives.string'), 'string');
  t.is(p.get('primitives.string', 'default'), 'string');
  t.is(p.get('missing'), undefined);
  t.is(p.get('missing', 'default'), 'default');

  t.deepEqual(p.get(), all);
});

test('value setting', t => {
  const p = Propmaster.clone(all);
  const value = p.set('primitives.string', { value: 'fixed' }).get('primitives.string');

  t.is(value, 'fixed');
  t.is(all.primitives.string, 'string');
});

test('cloning preserves original values', t => {
  const alteredValue = Propmaster.clone(all).set('primitives.string', { value: 'fixed' }).get('primitives.string');
  t.is(alteredValue, 'fixed');
  t.is(all.primitives.string, 'string');
})

test('altering modifies original values', t => {
  const start = clone(all);
  t.is(start.primitives.string, 'string');
  set(start, 'primitives.string', 'altered');
  t.is(start.primitives.string, 'altered');
  t.is(get(start, 'primitives.string'), 'altered');

  const finish = Propmaster.alter(start).set('primitives.string', { value: 'fixed' }).get();
  t.is(start.primitives.string, 'fixed');
  t.deepEqual(start, finish);
})

test('set from list of options', t => {
  const p = new Propmaster({
    value: 1,
    null: null,
    whitespace: '',
    emptyArray: [],
    emptyObject: {},
    undefined: undefined,
    final: 2,
  });

  t.is(p.get('value'), 1);
  p.set('value', ['null', 'whitespace', 'emptyArray', 'emptyObject', 'undefined', 'final']).get('value');
  t.deepEqual(p.get('value'), []);
});

