import test from 'ava';
import { Propmaster } from '../../src/index.js'
import * as values from '../fixtures/values.js';

test('non-empty type checks', t => {
  const p = new Propmaster(values.all);
  
  t.assert(p.get('primitives.string').is('string'));
  t.assert(p.get('primitives.bool').is('boolean'));
  t.assert(p.get('primitives.number').is('number'));

  t.assert(p.get('complex.date').is('date'));
  t.assert(p.get('complex.buffer').is('buffer'));
  t.assert(p.get('complex.map').is('map'));
  t.assert(p.get('complex.set').is('set'));

  t.assert(p.get('arrays.numbers').is('array'));
  t.assert(p.get('nested').is('object'));

  t.assert(p.get('primitives.string').isNot('undefined'));
  t.assert(p.get('primitives.bool').isNot('undefined'));
  t.assert(p.get('primitives.number').isNot('undefined'));
});

test('default empty checks', t => {
  const p = new Propmaster(values.all);
  
  t.is(p.get('primitives.string').isEmpty(), false);
  t.is(p.get('primitives.number').isEmpty(), false);
  t.is(p.get('primitives.true').isEmpty(), false);
  t.is(p.get('primitives.false').isEmpty(), false);
  t.is(p.get('primitives.unknown').isEmpty(), false);

  t.is(p.get('empty.undefined').isEmpty(), true);
  t.is(p.get('empty.null').isEmpty(), true);
  t.is(p.get('empty.string').isEmpty(), true);
  
  t.is(p.get('empty.whitespace').isEmpty(), false);
  t.is(p.get('empty.array').isEmpty(), false);
  t.is(p.get('empty.object').isEmpty(), false);
});

test('all empty checks', t => {
  const p = new Propmaster(values.all, { empty: { all: true } });
  
  t.is(p.get('primitives.string').isEmpty(), false);
  t.is(p.get('primitives.number').isEmpty(), false);
  t.is(p.get('primitives.true').isEmpty(), false);
  t.is(p.get('primitives.false').isEmpty(), true);
  t.is(p.get('primitives.unknown').isEmpty(), false);

  t.is(p.get('empty.undefined').isEmpty(), true);
  t.is(p.get('empty.null').isEmpty(), true);
  t.is(p.get('empty.string').isEmpty(), true);
  
  t.is(p.get('empty.whitespace').isEmpty(), true);
  t.is(p.get('empty.array').isEmpty(), true);
  t.is(p.get('empty.object').isEmpty(), true);
});

test('no empty checks', t => {
  const p = new Propmaster(values.all, { empty: { none: true } });
  
  t.is(p.get('primitives.string').isEmpty(), false);
  t.is(p.get('primitives.number').isEmpty(), false);
  t.is(p.get('primitives.true').isEmpty(), false);
  t.is(p.get('primitives.false').isEmpty(), false);
  t.is(p.get('primitives.unknown').isEmpty(), false);

  t.is(p.get('empty.undefined').isEmpty(), true);
  t.is(p.get('empty.null').isEmpty(), false);
  t.is(p.get('empty.string').isEmpty(), false);
  
  t.is(p.get('empty.whitespace').isEmpty(), false);
  t.is(p.get('empty.array').isEmpty(), false);
  t.is(p.get('empty.object').isEmpty(), false);
});

test('type coercion', t => {
  const p = new Propmaster(values.all);
  
  // Strings to array-of-strings
  t.assert(p.get('coercible.string').is('string'));
  t.assert(p.get('coercible.string').asArray().is('array'));
  t.assert(p.get('coercible.string').asArray().first().is('string'));

  // Strings to numbers
  t.assert(p.get('coercible.int').asNumber().is('number'));
  t.is(p.get('coercible.int').asNumber().value, values.coerced.int);

  t.assert(p.get('coercible.decimal').asNumber().is('number'));
  t.is(p.get('coercible.decimal').asNumber().value, values.coerced.decimal);

  t.assert(p.get('coercible.percent').asNumber().is('number'));
  t.is(p.get('coercible.percent').asNumber().value, values.coerced.percent);

  // Numbers and dates to strings
  t.assert(p.get('complex.date').is('date'));
  t.assert(p.get('complex.date').asString().is('string'));

  // This will absolutely break everywhere other than home,
  // its existence is both a personal and professional failure
  t.is(p.get('complex.date').asString().value, 'Tue Aug 16 1977 00:00:00 GMT-0500 (Central Daylight Time)');

  t.assert(p.get('primitives.true').is('boolean'));
  t.assert(p.get('primitives.true').asString().is('string'));
  t.is(p.get('primitives.true').asString().value, 'true');

  t.assert(p.get('primitives.number').is('number'));
  t.assert(p.get('primitives.number').asString().is('string'));
  t.is(p.get('primitives.number').asString().value, '1');

  // TODO: Strings to Dates
});
