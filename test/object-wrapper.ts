import test from 'ava'
import { all } from './fixtures/values.js'
import { Propmaster } from '../src/index.js';
import * as dot from 'opu';

test('value checking', t => {
  const p = new Propmaster(all);
  t.is(p.get('primitives.string').value, 'string');
  t.is(p.get('missing').value, undefined).valueOf;

  t.deepEqual(p.value, all);
});

test('value setting', t => {
  const p = new Propmaster(all);
  const value = p.set('primitives.string', { literal: 'fixed' }).get('primitives.string').value;

  t.is(value, 'fixed');
  t.is(all.primitives.string, 'string');
});

test('cloning preserves original values', t => {
  const alteredValue = new Propmaster(all)
    .set('primitives.string', { literal: 'fixed' })
    .get('primitives.string').value;
  t.is(alteredValue, 'fixed');
  t.is(all.primitives.string, 'string');
})

test('altering modifies original values', t => {
  const start = dot.clone(all);
  t.is(start.primitives.string, 'string');
  dot.set(start, 'primitives.string', 'altered');
  t.is(start.primitives.string, 'altered');
  t.is(dot.get(start, 'primitives.string'), 'altered');

  const finish = new Propmaster(start, { clone: false }).set('primitives.string', { literal: 'fixed' }).value;
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

  t.is(p.get('value').value, 1);
  p.set('value', ['null', 'whitespace', 'emptyArray', 'emptyObject', 'undefined', 'final']).get('value');
  t.deepEqual(p.get('value').value, []);
});

test('conditional set', t => {
  const p = new Propmaster({ value: 1, final: 2 });

  p.if(
    p => p.get('value').value === 1,
    p => p.set('value', { literal: 'modified' }),
    p => p.set('final', { literal: 'failed' }),
  );
  
  t.is(p.get('value').value, 'modified');
  t.is(p.get('final').value, 2);
});

