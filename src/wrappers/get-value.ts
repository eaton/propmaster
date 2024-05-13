import * as dot from "../dot/index.js";
import is from '@sindresorhus/is';
import { Handle, isLiteral, OneOrMore } from "./types.js";
import { ObjectProxy } from './interfaces.js'
import { isEmpty } from "../dot/empty.js";

export function getValue(object: ObjectProxy, handle: OneOrMore<Handle<ObjectProxy>>, fallback?: unknown) {
  for (const source of is.array(handle) ? handle : [handle]) {
    if (isLiteral(source)) {
      return source.literal;
    } else if (is.string(source)) {
      const tmp = dot.get(object.object, source, fallback);
      if (!isEmpty(tmp, object.options)) return tmp;
    } else {
      const tmp = source(object);
      if (!isEmpty(tmp)) return tmp;
    }
  }
  return undefined;
}
