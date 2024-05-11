import test from 'ava';
import { Propmaster } from '../src/propmaster.js'
import * as values from './fixtures/values.js';

test('chained string manipulation', t => {
  const p = new Propmaster(values.arrays);
  p.get('strings').join(',').changeCase('upper').split(',').set();

  t.deepEqual(p.get('strings').value, ['FIRST', 'SECOND', 'THIRD', 'FOURTH']);
});
