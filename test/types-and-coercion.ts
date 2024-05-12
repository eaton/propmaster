import test from 'ava';
import { Propmaster } from '../src/propmaster.js'
import * as values from './fixtures/values.js';
import is from '@sindresorhus/is';

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

test('type coercion', t => {
  const p = new Propmaster(values.coercable);
  
  // Things to array of strings
  t.assert(p.get('string').is('string'));
  t.assert(p.get('string').asArray().is('array'));
  t.assert(p.get('string').asArray().first().is('string'));

  // Strings to numbers
  t.assert(p.get('int').asNumber().is('number'));
  t.is(p.get('int').asNumber().value, values.coerced.int);

  t.assert(p.get('decimal').asNumber().is('number'));
  t.is(p.get('decimal').asNumber().value, values.coerced.decimal);

  t.assert(p.get('percent').asNumber().is('number'));
  t.is(p.get('percent').asNumber().value, values.coerced.percent);

  // TODO: Strings to Dates
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
  const p = new Propmaster(values.all, {
    nullIsEmpty: true,
    emptyStringIsEmpty: true,
    whiteSpaceIsEmpty: true,
    emptyArrayIsEmpty: true,
    emptyObjectIsEmpty: true,
    falseIsEmpty: true,
    falsyIsEmpty: true,
  });
  
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
  const p = new Propmaster(values.all, {
    nullIsEmpty: false,
    emptyStringIsEmpty: false,
    whiteSpaceIsEmpty: false,
    emptyArrayIsEmpty: false,
    emptyObjectIsEmpty: false,
    falseIsEmpty: false,
    falsyIsEmpty: false,
  });
  
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
