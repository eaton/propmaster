import is from '@sindresorhus/is';
import * as dot from 'obby';
import { ObjectProxy } from './interfaces.js';
import { Handle, isLiteral, OneOrMore } from './types.js';

export function getValue(
  object: ObjectProxy,
  handle: OneOrMore<Handle<ObjectProxy>>,
  fallback?: unknown,
) {
  for (const source of is.array(handle) ? handle : [handle]) {
    if (isLiteral(source)) {
      return source.literal;
    } else if (is.string(source)) {
      const tmp = dot.get(object.object, source, fallback);
      if (!dot.isEmpty(tmp, object.options.empty)) return tmp;
    } else {
      const tmp = source(object);
      if (!dot.isEmpty(tmp)) return tmp;
    }
  }
  return undefined;
}
