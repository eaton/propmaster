import test from 'ava'
import * as dot from "../src/dot/index.js";
import { empty } from './fixtures/values.js'

test('empty values detected', t => {
  const defaults = Object.values(empty).filter(v => !dot.isEmpty(v));
  const onlyUndefined = Object.values(empty).filter(v => !dot.isEmpty(v, dot.onlyUndefinedIsEmpty));
  const allEmpty = Object.values(empty).filter(v => !dot.isEmpty(v, dot.isEmptyOptsAll));

  t.is(allEmpty.length, 0);
  t.is(defaults.length, 3);
  t.is(onlyUndefined.length, 5);
})

test('deep empty filtering', t => {
  const test = { fullNumber: 1, fullArray: [1, 2, []], nested: empty, ...empty };
  const emptied = dot.unsetEmptyProperties(test, dot.isEmptyOptsAll);
  t.deepEqual(emptied, { fullArray: [1, 2], fullNumber: 1 });
});