import test from 'ava';
import { Propmaster } from '../../src/propmaster.js'
import * as values from '../fixtures/values.js';

test('property size measurement', t => {
  let p = new Propmaster(values.all);
  t.is(p.get('primitives.string').size(true).value, '6 characters');
  t.is(p.get('complex.buffer').size(true).value, '8 B');
  t.is(p.get('complex.map').size(true).value, '3 items');

  p = new Propmaster(values.all);
  t.is(p.get('primitives.string').size().value, 6);
  t.is(p.get('complex.buffer').size().value, 8);
  t.is(p.get('complex.map').size().value, 3);
});