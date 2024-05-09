import test from 'ava'
import { all } from './fixtures/values.js'
import { clone } from '../src/functions/dot.js';
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
  const cloned = clone(all);
  t.is(cloned.primitives.string, 'string');

  const ap = Propmaster.alter(cloned).set('primitives.string', { value: 'fixed' }).get();
  t.is(cloned.primitives.string, 'fixed');
  t.deepEqual(ap, cloned);
})

test('set from list of options', t => {
  const p = new Propmaster({
    value: 1,
    whitespace: '',
    emptyArray: [],
    emptyObject: {},
    null: null,
    undefined: undefined,
    final: 2,
  });
  const value = p.set('primitives.string', { value: 'fixed' }).get('primitives.string');

  t.is(value, 'fixed');
  t.is(all.primitives.string, 'string');
});
