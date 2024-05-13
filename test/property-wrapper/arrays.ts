import test from 'ava';
import { Propmaster } from '../../src/index.js'
import * as values from '../fixtures/values.js';

test('joining, splitting, sorting', t => {
  const p = new Propmaster(values.arrays);

  // These assume each operation mutates the array in place, and will need to be
  // revisited when I add a mechanism for chains to manipulate values nondestructively.

  t.deepEqual(p.get('strings').value, ['first', 'second', 'third', 'fourth']);
  t.is(p.get('strings').join(',').value, 'first,second,third,fourth');
  t.deepEqual(p.get('strings').split(',').reverse().value, ['first', 'second', 'third', 'fourth'].reverse());
  t.is(p.get('strings').first().value, 'fourth');
  t.assert(p.get('strings').is('string'));
});

test('array filtering', t => {
  const p = new Propmaster(values.arrays);

  // These assume each operation mutates the array in place, and will need to be
  // revisited when I add a mechanism for chains to manipulate values nondestructively.

  t.deepEqual(p.get('strings').filter('*o*').value, ['second', 'fourth']);
  t.deepEqual(p.get('numbers').sort('desc').value, [4,3,2,1]);
  t.is(p.get('bools').nth(1).value, false);
  t.deepEqual(p.get('dates').last().value, values.arrays.dates[1]);
});
