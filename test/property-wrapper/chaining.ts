import test from 'ava';
import { Propmaster } from '../../src/index.js'
import * as values from '../fixtures/values.js';

test('batched mutations', t => {
  const p = new Propmaster(values.arrays);
  t.deepEqual(p.get('strings').value, ['first', 'second', 'third', 'fourth']);

  p.get('strings').join(',').changeCase('upper').split(',');
  t.deepEqual(p.get('strings').value, ['FIRST', 'SECOND', 'THIRD', 'FOURTH']);

  p.options.batchMutations = true;
  p.get('strings').join(',').changeCase('lower').split(',');
  t.deepEqual(p.get('strings').value, ['FIRST', 'SECOND', 'THIRD', 'FOURTH']);

  p.get('strings').join(',').changeCase('lower').split(',').set();
  t.deepEqual(p.get('strings').value, ['first', 'second', 'third', 'fourth']);
});

