import test from 'ava';
import { Propmaster } from '../../src/propmaster.js'
import * as values from '../fixtures/values.js';

test('primitive equality', t => {
  const p = new Propmaster(values.all);
  
  t.assert(p.get('primitives.string').eq('string'));
  t.assert(p.get('primitives.true').eq(true));
  t.assert(p.get('primitives.false').eq(false));
  t.assert(p.get('primitives.number').eq(1));

  t.assert(p.get('primitives.number').neq(0));
  t.assert(p.get('primitives.string').neq('dummy text'));
  t.assert(p.get('primitives.true').neq(false));
});

test('greater/less/between', t => {
  const p = new Propmaster(values.all);
  
  t.assert(p.get('primitives.number').gt(0));
  t.assert(p.get('primitives.number').lt(2));
  t.assert(p.get('primitives.number').bt(0,2));

  t.assert(p.get('primitives.string').gt('alpha'));
  t.assert(p.get('primitives.string').lt('zeta'));
  t.assert(p.get('primitives.string').bt('alpha','zeta'));

  t.assert(p.get('complex.date').gt(new Date(1970, 0, 1)));
  t.assert(p.get('complex.date').lt(new Date(2100, 0, 1)));
  t.assert(p.get('complex.date').bt(new Date(1970, 0, 1), new Date(2100, 0, 1)));

  t.assert(!p.get('primitives.bool').gt(0));
  t.assert(!p.get('primitives.bool').lt(2));
  t.assert(!p.get('primitives.bool').bt(0,2));
});

test('wildcards', t => {
  const p = new Propmaster(values.all);

  t.assert(p.get('primitives.string').like('*ing'));
  t.assert(p.get('primitives.string').notLike('test')); 

  t.assert(p.get('primitives.string').like(/.trin\w/));  
  t.assert(p.get('primitives.string').notLike(/\d+/));  
})

test('array inclusion', t => {
  const p = new Propmaster(values.all);

  t.assert(p.get('primitives.number').in([1,2,3,4]));
  t.assert(p.get('primitives.number').notIn([2,3,4,5]));

  t.assert(p.get('primitives.string').in(['some', 'text', 'string']));
  t.assert(p.get('primitives.string').notIn(['other', 'text']));
  t.assert(p.get('primitives.string').notIn([1,2,3,4]));

  t.assert(p.get('arrays.strings').has('first'));
  t.assert(p.get('arrays.strings').excludes('apple'));

  t.assert(p.get('arrays.numbers').has(1));
  t.assert(p.get('arrays.numbers').excludes(-1));
  t.assert(p.get('arrays.numbers').excludes('string'));
})

